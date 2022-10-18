import React, {useContext, useEffect, useState} from 'react';
import Layout from "../components/Layout";
import CheckoutWizard from "../components/CheckoutWizard";
import {useRouter} from "next/router";
import {Store} from "../utils/Store";
import {toast} from "react-toastify";
import Cookies from "js-cookie";

export default function PaymentScreen() {

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

    const {state, dispatch} = useContext(Store)
    const {cart} = state
    const {shippingAddress, paymentMethod} = cart

    const router = useRouter();

    const submitHandler = (e) => {
        e.preventDefault()
        if (!selectedPaymentMethod) {
            return toast.error('Payment method is required')
        }
        dispatch({type: 'SAVE_PAYMENT_METHOD', payload: setSelectedPaymentMethod});
        Cookies.set(
            'cart',
            JSON.stringify({
                ...cart,
                paymentMethod: selectedPaymentMethod
            })
        )
        router.push('/placeorder')
    }

    useEffect(() => {
        if (!shippingAddress.address) {
            return router.push('/shipping')
        }
        setSelectedPaymentMethod(paymentMethod || '')
    }, [paymentMethod, router, shippingAddress.address])

    return (
        <Layout title="Payment Method">
            <CheckoutWizard activeStep={2} />
            <form action="" className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
                <h1 className="mb-4 text-xl">Payment Method</h1>
                {
                    ['PayPal', 'Stripe', 'CashOnDelivery'].map((payment) => (
                        <div className="mb-4" key={payment}>
                            <input
                                name="paymentMethod"
                                className="p-2 outline-none focus:ring-0"
                                id={payment}
                                type="radio"
                                checked={selectedPaymentMethod === payment}
                                onChange={() => setSelectedPaymentMethod(payment)}
                            />

                            <label htmlFor={payment} className="p-2">
                                {payment}
                            </label>
                        </div>
                    ))}
                <div className="mb-4 flex justify-between">
                    <button
                        onClick={() => router.push('/shipping')}
                        type="button"
                        className="default-button"
                    >
                        Back
                    </button>
                    <button className="primary-button">Next</button>
                </div>
            </form>
        </Layout>
    )
}
PaymentScreen.auth = true;