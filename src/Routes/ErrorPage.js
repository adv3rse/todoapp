import { useRouteError } from "react-router-dom";
import React from "react";
import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
export default function ErrorPage() {
    const [show, setShow] = useState(true);
    const error = useRouteError();
    if (show) {
        return (
            <Alert className="myAlert" key="danger" variant="danger">
                <h1>Ooops!</h1>
                Sorry, This Page Not Found.
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() => setShow(false)} variant="outline-danger">
                        Close me
                    </Button>
                </div>
            </Alert>

        );
    }
    return (<Button onClick={() => setShow(true)} variant="outline-success">
        Open Me!
    </Button>)
}