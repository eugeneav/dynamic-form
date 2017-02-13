import React from 'react';
import ReactDom from 'react-dom';
import {Provider, connect} from 'react-redux';
import {changeViewModel, getActiveUser} from './actions';

import {createStore, applyMiddleware, bindActionCreators, compose} from 'redux';
import {modelApp} from './reducers';
import {updateModelMiddleware} from './middleware';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(modelApp, composeEnhancers(
    applyMiddleware(updateModelMiddleware)
));

class InputBase extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(newValue) {
        const {id} = this.props.data;
        this.props.onChange(id, newValue);
    }
}

class FormBase extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(key, value) {
        this.props.onViewModelUpdate(key, value);
    }
}

class InputText extends InputBase {
    render() {
        const component = <div>
            <input
                type='text'
                value={this.props.data.value}
                onChange={event => this.onChange(event.target.value) }
            /><span>{this.props.data.value}</span>
        </div>;
        return this.props.data.isVisible ? component : null;
    }
}

class Form extends FormBase {
    render() {
        const {model} = this.props;

        let form = null;
        if (model) {
            form =
                <form>
                    <InputText ref={'first_name'} data={model.get('first_name')} onChange={this.onChange}/>
                    <InputText ref={'last_name'} data={model.get('last_name')} onChange={this.onChange}/>
                    <InputText ref={'email'} data={model.get('email')} onChange={this.onChange}/>
                    <InputText ref={'address'} data={model.get('address')} onChange={this.onChange}/>
                    <InputText ref={'field1'} data={model.get('field1')} onChange={this.onChange}/>
                    <InputText ref={'field2'} data={model.get('field2')} onChange={this.onChange}/>
                </form>;
        }
        return form;
    }
}

class FormContainer extends React.Component {

    constructor(props) {
        super(props);
        this.onViewModelUpdate = this.onViewModelUpdate.bind(this);
    }

    componentDidMount() {
        const {getActiveUser} = this.props;
        getActiveUser();
    }

    onViewModelUpdate(key, value) {
        const {changeViewModel, model} = this.props;
        changeViewModel({modelId: model.get('userViewModel').get('id'), key: key, value: value});
    }

    render() {
        return <Form model={this.props.model.get('userViewModel')} onViewModelUpdate={ this.onViewModelUpdate }/>
    }
}

const mapStateToProps = (state, ownProps) => {

    return {
        model: state,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({changeViewModel, getActiveUser}, dispatch);
};

const FormContainerRedux = connect(
    mapStateToProps,
    mapDispatchToProps
)(FormContainer);

class App extends React.Component {
    render() {
        return (
            <div>
                <FormContainerRedux />
            </div>
        );
    }
}

ReactDom.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('app'));
