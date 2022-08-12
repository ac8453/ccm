import React, { Component } from 'react'
import { Hub, Auth, Logger, API } from 'aws-amplify'

const { Provider, Consumer } = React.createContext({})
const logger = new Logger('UserProvider', 'INFO')

class User extends Component {
    constructor() {
        super();
        const stateExists = window.localStorage.getItem('ccm-user-state')
        if (stateExists && stateExists !== 'undefined') {
            console.log('Exists');
            this.state = JSON.parse(window.localStorage.getItem('ccm-user-state'));
        }
        else {
            console.log('No user info...')
            this.state = { isLoggedIn: true, username: 'none', id: 'none', email: 'none' }
        }
    }
    setState = state => {
        super.setState(state)
    }
    componentDidMount = async () => {
        logger.info('listening for auth events...')
        Hub.listen('auth', this.onAuthEvent)
        if (!this.stateExists) {
            const user = await Auth.currentAuthenticatedUser()
            Hub.dispatch('auth', { event: 'signIn', data: user })
        }
        try {
            const user = await Auth.currentAuthenticatedUser()
            let newState = { isLoggedIn: true, username: user.username, id: user.attributes.sub, email: user.attributes.email }
            this.setState(newState)
        } catch (error) {
            console.warn(error)
        }
    }

    componentWillUnmount = () => {
        logger.info('removed listener for auth events...')
        Hub.remove('auth', this.onAuthEvent)
    }

    render = () => (
        <Provider value={this.state}>
            {this.props.children}
        </Provider>
    )
    async fetchAdditionalUserInfo(username) {
        try {
            return await API
                .post('ccmGTestApiLambda', '/appuser',
                    {
                        body: { "id": username },
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
        }
        catch (err) {
            console.log('error fetching additional user details:', err)
        }
    }

    onAuthEvent = async data => {
        console.log(data)
        logger.info('auth event', data)
        const { payload: { event } } = data

        switch (event) {
            case 'signIn': {
                const user = data.payload.data
                const userCodes = await this.fetchAdditionalUserInfo(user.username)
                let newState = {
                    isLoggedIn: true,
                    username: user.username,
                    id: user.attributes.sub,
                    email: user.attributes.email,
                    accountId: userCodes.Item.accountId,
                    externalId: userCodes.Item.externalId
                }
                this.setState(newState)
                window.localStorage.setItem('ccm-user-state', JSON.stringify(newState));
                break
            }
            case 'signOut':
            default: {
                this.setState(() => ({}))
                window.localStorage.removeItem('ccm-user-state')
                break
            }
        }
    }
}
export const UserProvider = User
UserProvider.displayName = 'UserProvider'

export default Consumer