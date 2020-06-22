import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../Store/actions/index';
import { updateObject } from '../../../shared/utility';
class ContactData extends Component {
    state = {

        orderForm : {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                validity: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Street'
                },
                value: '',
                validation: {
                    required: true
                },
                validity: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 10
                },
                validity: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                validity: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-Mail'
                },
                value: '',
                validation: {
                    required: true
                },
                validity: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: "cheapest", displayValue: 'Cheapest'}
                    ]
                },
                value: 'fastest',
                validation: {},
                validity: true
            }
        },
        
        formIsValid: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        // console.log(this.props.ingredients);
        const formData = {};
        for (let formElementIdentifier in this.state.orderForm){
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        this.setState({ loading: true });
        const orders = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData,
            userId: this.props.userId
        }

        this.props.onOrderBurger(orders, this.props.token);
        // axios.post('/orders.json', orders)
        //     .then (response => {
        //         // console.log(response);
        //         this.setState({ loading: false });
        //         this.props.history.push('/');
        //     })
        //     .catch(error => {
        //         // console.log(error);
        //         this.setState({ loading: false });
        //     });

    }

    checkValidity (value, rules)  {
        let isValid = true;
        
        if(!rules){
            return true;
        }
        if (rules.required){
            isValid = value.trim() !== '' && isValid;
        } 

        if (rules.minLength ){
            isValid = value.length >= rules.minLength && isValid;
        }

        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid;
        }
        return isValid;

    }

    inputChangeHandler = (event, inputIdentifier) => {
        // console.log(inputIdentifier);
        // const updatedOrderForm = {...this.state.orderForm}
        // const updatedFormElement = {...updatedOrderForm[inputIdentifier]}
        // updatedFormElement.value = event.target.value;
        // updatedFormElement.validity = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        // updatedFormElement.touched = true;
        // console.log(updatedFormElement);
        // updatedOrderForm[inputIdentifier] = updatedFormElement;

        const updatedFormElement = updateObject(this.state.orderForm[inputIdentifier], {
            value: event.target.value,
            touched : true,
            validity : this.checkValidity(event.target.value, this.state.orderForm[inputIdentifier].validation)
        });

        const updatedOrderForm = updateObject(this.state.orderForm, {
            [inputIdentifier]: updatedFormElement
        });

        let formIsValid = true;
        for(let inputIdentifier in updatedOrderForm){
            formIsValid = updatedOrderForm[inputIdentifier].validity && formIsValid;
        }

        this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid});
    }
    render () {
        let formElementsArray = [];
        for (let key in this.state.orderForm){
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }
        
        let form = (
        <form onSubmit={this.orderHandler}>
            {/* <Input inputtype="input" type="text" name="name" placeholder="Your Name" />
            <Input inputtype="input" type="email" name="email" placeholder="Your Email" />
            <Input inputtype="input" type="text" name="street" placeholder="Your Street" />
            <Input inputtype="input" type="text" name="postal" placeholder="Your Postal" /> */}
            
            {formElementsArray.map(formElement => (
                <Input 
                    key={formElement.id}
                    elementType={formElement.config.elementType} 
                    elementConfig={formElement.config.elementConfig} 
                    value={formElement.config.value} 
                    invalid = {!formElement.config.validity}
                    shouldValidate = {formElement.config.validation}
                    touched = {formElement.config.touched}
                    changed={(event) => this.inputChangeHandler(event, formElement.id)}/>
            ))}
            <Button btnType="Success" disabled={!this.state.formIsValid}> ORDER </Button>
        </form>);
        if(this.props.loading) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4> Enter your contact data </h4>
                {form}
            </div>

        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (withErrorHandler(ContactData, axios));