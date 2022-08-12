import Container from '@mui/material/Container';
import { API } from 'aws-amplify';
import { useCallback, useEffect, useState } from 'react';
import ScPortfolios from './sc_portfolios';
import ScProducts from './sc_products';
import React from 'react';

const Portfolios = () => {
    const initialState = JSON.parse(window.localStorage.getItem('ccm-user-state'))
    const [portfolios, setPortfolios] = useState([])
    const [currentPortfolio, setCurrentPortfolio] = useState()
    const [showProducts, setShowProducts] = useState(false)
    const [showPortfolios, setShowPortfolios] = useState(true)
    const accountId = initialState.accountId
    const externalId = initialState.externalId

    const fetchPortfolioItems = useCallback(async () => {
        try {
            const portfolioItemData = await API
                .post('ccmGTestApiLambda', '/portfolios',
                    {
                        body: { "accountId": accountId, "externalId": externalId },
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
            setPortfolios(portfolioItemData.PortfolioDetails)
        }
        catch (err) {
            console.log('error fetching portfolio details:', err)
        }
    }, [accountId, externalId])

    const handleShowProducts = async (portfolio) => {
        setCurrentPortfolio(portfolio)
        setShowPortfolios(false)
        setShowProducts(true)
    }
    useEffect(() => {
        fetchPortfolioItems()
    }, [fetchPortfolioItems])
    return (
        <Container>
            {(showPortfolios && !showProducts) ?
                <ScPortfolios
                    portfolios={portfolios}
                    setCurrentPortfolio={setCurrentPortfolio}
                    handleShowProducts={handleShowProducts}
                /> :
                <ScProducts
                    accountId={accountId}
                    externalId={externalId}
                    portfolio={currentPortfolio}
                    setShowProducts={setShowProducts}
                    setShowPortfolios={setShowPortfolios}
                />}
        </Container>
    )
}

export default Portfolios