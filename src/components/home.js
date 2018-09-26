import React, { Component } from 'react';
import { Layout, List, Button } from 'antd';
import axios from 'axios';
import Cryptr from 'cryptr';
import isIncognito from 'is-incognito';
import { Document, Page } from 'react-pdf';

const { Content } = Layout;
const cryptr = new Cryptr('nk<%4]<`(6Q@X3A(0gBS5&l[X3dIE.');
const backend = process.env.REACT_APP_BACKEND;

class Home extends Component {

    constructor() {
        super();
        this.state = {
            documents: [],
            isViewing: false,
            file: null,
            currentPage: 1,
            numPages: null,
            isViewable: false,
            currentScale: 2
        };
    }

    getDocuments = () => {
        axios.get(`${backend}/api/file`)
            .then(response => response.data.content)
            .then(data => {
                this.setState({ documents: data });
            });


    }

    componentDidMount() {
        // document.addEventListener('contextmenu', event => event.preventDefault());
        this.getDocuments();
        isIncognito().then(response => response)
            .then(data => {
            }).catch(err => {
                this.setState({ isViewable: true })
            });
    }

    viewFile = (item) => {
        axios.get(`${backend}/api/token`)
            .then(response => response.data.content)
            .then(data => {
                this.setState({
                    file: {
                        url: `${backend}/api/view?file=${item}`,
                        withCredentials: true,
                        httpHeaders: {
                            'Authorization': `Bearer ${cryptr.decrypt(data)}`
                        }
                    }, isViewing: true
                })
            });
    }

    goBack = () => {
        this.setState({ isViewing: false })
    }

    increasePage = () => {
        var currentScale = this.state.currentScale + 0.5;
        this.setState({ currentScale })
    }

    decreasePage = () => {
        var currentScale = this.state.currentScale - 0.5;
        this.setState({ currentScale })
    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }

    onKeyPressed = (e) => {
        if (this.state.isViewing) {
            var key = e.keyCode;
            var currentPage;
            if (key === 39) {
                currentPage = this.state.currentPage + 1;
                if (currentPage <= this.state.numPages) {
                    this.setState({ currentPage });
                }

            } else if (key === 37) {
                currentPage = this.state.currentPage - 1;
                if (currentPage >= 1) {
                    this.setState({ currentPage });
                }
            }
        }
    }


    render() {
        const { documents, isViewing, file, currentPage, isViewable, currentScale } = this.state;

        return (
            <div onKeyDown={this.onKeyPressed}
                tabIndex="0">
                {isViewable ?
                    <Layout style={{ minHeight: '100vh' }}>
                        <Layout>
                            {isViewing ?
                                <Content style={{ margin: '24px 10% 24px 10%' }}>
                                    <Document
                                        file={file}
                                        onLoadSuccess={this.onDocumentLoadSuccess}
                                    >
                                        <Page pageNumber={currentPage} scale={currentScale}>
                                        </Page>
                                    </Document>
                                </Content>
                                :
                                <Content style={{ margin: '24px 25% 10px 25%' }}>
                                    <List
                                        style={{ background: '#FFF' }}
                                        header={<div>All files</div>}
                                        bordered
                                        dataSource={documents}
                                        renderItem={item => (<List.Item actions={[<a onClick={() => this.viewFile(item)}>View</a>]}>{item}</List.Item>)}
                                    />
                                </Content>
                            }
                        </Layout>
                        {
                            isViewing ?
                                <div>
                                    <Button onClick={this.goBack} className='myFloatingBtn' type="primary" shape="circle" icon="close" size='large' />
                                    <Button onClick={this.increasePage} className='myIncreaseBtn' type="primary" shape="circle" icon="plus" size='large' />
                                    <Button onClick={this.decreasePage} className='myDecreaseBtn' type="primary" shape="circle" icon="minus" size='large' />
                                </div>

                                : null
                        }
                    </Layout> : null}
            </div>
        );
    }
}

export default Home;
