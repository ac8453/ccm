import { Button, Card, CardContent, Modal, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { Component } from "react";
import { DropzoneAreaBase } from 'material-ui-dropzone'
import { API } from 'aws-amplify'
import axios from 'axios'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: '90%',
    width: 800,
    bgcolor: 'white',
    border: '2px solid DodgerBlue',
    boxShadow: 30,
    p: 4,
    overflow: 'auto'
};
export default class AddProduct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showAddProduct: this.props.showAddProduct,
            formProductName: '',
            formProductDesc: '',
            formOwner: '',
            formFile: null,
            formEmail: '',
            formSupportDesc: '',
            signed: {},
            s3Message: {
                color: 'text.primary',
                text: 'or click to open the dialog'
            }
        };
    }
    handleProductNameUpdate = (event) => {
        this.setState({ formProductName: event.target.value })
    }
    handleProductDescUpdate = (event) => {
        this.setState({ formProductDesc: event.target.value })
    }
    handleOwnerUpdate = (event) => {
        this.setState({ formOwner: event.target.value })
    }
    handleFileUpdate = async (e) => {
        await this.GetSignedUrl()
        this.setState({
            formFile: e[0]
        }, async () => {
            console.log("Before: ", this.state.formFile)
            const new_file = new File([this.state.formFile], this.state.signed.Key, { type: "application/json" });
            console.log("Renamed File: ", new_file);
            var options = {
                headers: {
                    'Content-Type': new_file.type
                }
            }
            var res = await axios.put(this.state.signed.uploadURL, new_file, options);
            if (res.statusText === 'OK') {
                let message = { color: 'success.main', text: `File ${this.state.formFile.name} has been successfully uploaded` }
                this.setState({ s3Message: message })
            }
            else {
                let message = { color: 'error.main', text: 'Error during the file upload. Refresh and try again.' }
                this.setState({ s3Message: message })
            }
        })
    }
    handleEmailUpdate = (event) => {
        this.setState({ formEmail: event.target.value })
    }
    handleSupportDescUpdate = (event) => {
        this.setState({ formSupportDesc: event.target.value })
    }
    handleSubmit = async (e) => {
        e.preventDefault()

        console.log(this.state.formProductName, this.state.formProductDesc, this.state.formOwner,
            this.state.formFile, this.state.formEmail, this.state.formSupportDesc, this.state.signed)
        const s3response = await this.uploadFile(this.state.formFile, this.state.signed.uploadUrl)
        console.log(await s3response)
    }
    GetSignedUrl = async () => {
        const resSigned = await this.fetchSignedUrl()
        this.setState({ signed: resSigned }, () => {
            console.log("SignedUrl: ", this.state.signed)
        })
    }
    fetchSignedUrl = () => {
        return API.get('ccmGTestApiLambda', '/getsignedurl', { headers: { "Content-Type": "application/json" } })
    }
    handleCloseAddProduct = () => {
        this.props.handleCloseAddProduct()
    }
    uploadFile = async (file, signedUrl) => {
        const init = {
            body: file,
            headers: { 'Content-Type': '*' }
        }
        const res = await API.post(signedUrl, '', init)
        return res
    }
    render() {
        return (
            <Modal
                open={this.props.showAddProduct}
                onClose={() => this.handleCloseAddProduct()}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <>    <Box
                    component="section"
                    sx={style}>
                    <Typography component="h1" variant="h4" align='center'>
                        Create product
                    </Typography>
                    <Card>
                        <CardContent>
                            <Box sx={{ textAlign: "center", mb: 1 }}>

                                <Typography
                                    color="text.secondary"
                                    component="div"
                                    variant="h6"
                                    align='left'>
                                    Product details
                                </Typography>
                            </Box>
                            <Box component="form" noValidate>
                                <TextField
                                    id="productName"
                                    fullWidth
                                    label="Product Name"
                                    margin="normal"
                                    variant="outlined"
                                    onChange={event => this.handleProductNameUpdate(event)}
                                />
                                <Typography
                                    color="text.secondary"
                                    component="p"
                                    variant="subtitle2">

                                    Choose an easily identifiable name for your product.
                                </Typography>
                                <TextField
                                    id="description"
                                    fullWidth
                                    label="Product description - optional"
                                    margin="normal"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    onChange={event => this.handleProductDescUpdate(event)}
                                />
                                <Typography
                                    color="text.secondary"
                                    component="p"
                                    variant="subtitle2">

                                    This description helps the user choose the correct product.
                                </Typography>
                                <TextField
                                    id="owner"
                                    fullWidth
                                    label="Owner"
                                    margin="normal"
                                    variant="outlined"
                                    onChange={event => this.handleOwnerUpdate(event)}
                                />
                                <Typography
                                    color="text.secondary"
                                    component="p"
                                    variant="subtitle2"
                                    sx={{ pb: 2 }}>
                                    The person or organization that publishes this product.
                                </Typography>
                                <DropzoneAreaBase
                                    acceptedFiles={['.json', '.yaml', '.yml']}
                                    dropzoneText={"Drag and Drop your CloudFormation script"}
                                    onChange={(files) => console.log('Files:', files)}
                                    showAlerts={false}
                                    onDrop={this.handleFileUpdate}
                                    onAlert={(message, variant) => console.log(`${variant}: ${message}`)} />
                                <Typography
                                    color={this.state.s3Message.color}
                                    component="p"
                                    variant="body2"
                                    align="center"
                                    sx={{ pb: 2 }}>
                                    {this.state.s3Message.text}
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    component="p"
                                    variant="subtitle2">
                                    Upload CloudFormation template (only .json files are supported).
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                    <Card sx={{ mt: 2 }}>
                        <CardContent>
                            <Box sx={{ textAlign: "center", mb: 1 }}>

                                <Typography
                                    color="text.secondary"
                                    component="div"
                                    variant="h6"
                                    align='left'>

                                    Support details
                                </Typography>
                            </Box>
                            <Box component="form" noValidate>
                                <TextField
                                    id="email"
                                    fullWidth
                                    label="Email contact - optional"
                                    margin="normal"
                                    variant="outlined"
                                    onChange={event => this.handleEmailUpdate(event)} />
                                <Typography
                                    color="text.secondary"
                                    component="p"
                                    variant="subtitle2">
                                    The email address to report issues with the product.
                                </Typography>
                                <TextField
                                    id="supportDescription"
                                    fullWidth
                                    label="Support description - optional"
                                    margin="normal"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    onChange={event => this.handleSupportDescUpdate(event)} />
                                <Typography
                                    color="text.secondary"
                                    component="p"
                                    variant="subtitle2">
                                    The description of how users should use the email contact and support link.
                                </Typography>
                            </Box>
                            <Button fullWidth size="large" sx={{ mt: 2 }} variant="contained" onClick={this.handleSubmit}>
                                Upload
                            </Button>
                        </CardContent>
                    </Card>
                </Box></>
            </Modal >
        )
    }
}