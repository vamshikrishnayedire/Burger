import React, { Component } from 'react';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { connect } from 'react-redux';
import * as actions from '../../Store/actions/index';


class BurgerBuilder extends Component{
    state = {
        purchasing: false
    }

    componentDidMount () {
        this.props.onInitIngredients();
    }

    updatePurchaseState (ingredients){
        
        console.log(ingredients);
        const sum = Object.keys(ingredients)
                    .map(igkey => {
                        return ingredients[igkey];
                    })
                    .reduce((sum, el) => {
                        return sum+el;
                    }, 0);
        return sum>0;
        
        // this.setState({
        //     purchasable: sum>0
        // });
    }

    addIngredientHandler = (type) => {
        // const oldCount = this.state.ingredients[type];
        // const updatedCount = oldCount + 1;
        // const updatedIngredients = {
        //     ...this.state.ingredients
        // };
        // updatedIngredients[type] = updatedCount;
        // const priceAddition = INGRDIENT_PRICES[type];
        // const oldPrice = this.state.totalPrice;
        // const newPrice = oldPrice + priceAddition;
        // this.setState({
        //     ingredients: updatedIngredients,
        //     totalPrice: newPrice
        // });
        // this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) =>{
        // const oldCount = this.state.ingredients[type];

        // if (oldCount <= 0){
        //     return;
        // }
        // const updatedCount = oldCount-1;
        // const updatedIngredients = {
        //     ...this.state.ingredients
        // }
        // updatedIngredients[type] = updatedCount;

        // const priceRemoval = INGRDIENT_PRICES[type];
        // const oldPrice = this.state.totalPrice;
        // const newPrice = oldPrice - priceRemoval;

        // this.setState({
        //     ingredients: updatedIngredients,
        //     totalPrice: newPrice
        // });
        // this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        if(this.props.isAuthenticated){
            this.setState({ purchasing: true });
        } else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
        
    }

    purchaseCancelHandler = () =>{
        this.setState({
            purchasing: false
        });
    }

    purchaseContinueHandler = () =>{
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }
    render() {

        const disabledInfo = {
            ...this.props.ings
        }

        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
    
        let burger = this.props.error ? <p>Ingrdients can not be loaded..!!</p> : <Spinner />;
        let orderSummary = null;
        if(this.props.ings){
            burger = (
                <Auxiliary>
                    <Burger ingredients = {this.props.ings}/>
                    <BuildControls 
                        ingredientAdded= {this.props.onIngredientAdded}
                        ingredientRemoved = {this.props.onIngredientRemoved   }
                        disabled={disabledInfo}
                        price={this.props.price}
                        isAuth={this.props.isAuthenticated}
                        // purchasable = {this.state.purchasable}
                        purchasable = {this.updatePurchaseState(this.props.ings)}
                        ordered = {this.purchaseHandler}
                    />
                </Auxiliary>
            );
            orderSummary =   <OrderSummary 
                ingredients={this.props.ings}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued = {this.purchaseContinueHandler}
                price={this.props.price}
            />;
        }
        console.log(disabledInfo);
        return (
            <Auxiliary>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                   {orderSummary}
                </Modal>
                {burger}
            </Auxiliary>
        );
    }
}


const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token != null
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch( actions.addIngredient(ingName)),
        onIngredientRemoved:  (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    };
}
export default connect(mapStateToProps, mapDispatchToProps) (withErrorHandler(BurgerBuilder, axios));