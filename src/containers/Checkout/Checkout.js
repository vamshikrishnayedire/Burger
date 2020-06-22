import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import { Route, Redirect } from 'react-router-dom';
import ContactData from './ContactData/ContactData';
import { connect } from 'react-redux';
// import * as actions from '../../Store/actions/index';
class Checkout extends Component {
    // componentDidMount () {
    //     this.props.onInitPurchase();
    // }
    // state = {
    //     ingredients : null,
    //     price: 0
    // }

    // componentWillMount = () => {
    //     console.log(this.props);
    //     const query = new URLSearchParams(this.props.location.search);
    //     const ingredients = {};
    //     let price = 0;
    //     for (let param of query.entries()){
    //         if(param[0] === 'price'){
    //             price = param[1];
    //         }else {
    //             ingredients[param[0]] = +param[1];
    //         }
    //     }
        
    //     this.setState({ ingredients: ingredients, totalPrice: price});
    //     console.log(ingredients);
    // }
    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }
    render () {
        let summary = <Redirect to="/" />
        if(this.props.ings){
            const purchaseRedirect = this.props.purchased ? <Redirect to="/" /> : null;
            summary = ( 
                <div>
                    {purchaseRedirect}
                    <CheckoutSummary 
                        ingredients={this.props.ings} 
                        checkoutCancelled={this.checkoutCancelledHandler}
                        checkoutContinued={this.checkoutContinuedHandler}/>
                    <Route 
                        path={this.props.match.path + '/contact-data'}
                        component={ContactData}
                        // render = {(props) => (<ContactData ingredients={this.props.ings} price={this.props.price} {...props}/>)} 
                        />
                </div>
            )
        }
        return summary;
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    };
}

// const mapDispatchToProps = dispatch => {
//     return {
//         onInitPurchase: () => dispatch(actions.purchaseInit())
//     };
// };

export default connect (mapStateToProps) (Checkout);