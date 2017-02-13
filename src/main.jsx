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
        this.state = {
            value: props.data.value,
            isVisible: props.data.isVisible,
        };
        this.onChange = this.onChange.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.data.value,
            isVisible: nextProps.data.isVisible,
        });
    }

    onChange(newValue) {
        const {id} = this.props.data;
        this.props.onChange(id, newValue);
        this.setState({
            value: newValue,
            isVisible: this.state.isVisible,
        });
    }

    updateState(key, value) {
        throw `${this.constructor.name} class does not override updateState() method of InputBase class`;
    }
}

class FormBase extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.updateChildElementsVisibility = this.updateChildElementsVisibility.bind(this);
    }

    onChange(key, value) {
        this.updateChildElementsVisibility(key, value);
        this.props.onViewModelUpdate(key, value);
    }

    updateChildElementsVisibility(propKey, propValue) {
        Object.keys(this.refs).forEach(key => {
            this.refs[key].updateState(propKey, propValue);
        });
    }
}

class InputText extends InputBase {
    render() {
        const component = <div>
            <input
                type='text'
                value={this.state.value}
                onChange={event => this.onChange(event.target.value) }
            /><span>{this.props.data.value}</span>
        </div>;
        return this.state.isVisible ? component : null;
    }

    // @Override
    updateState(key, value) {
        if (this.props.data.hasOwnProperty('hideFor')) {
            const hideFor = this.props.data.hideFor;
            if (hideFor.hasOwnProperty(key)) {
                const values = hideFor[key];
                const valuesLength = values.length;
                for (let i = 0; i < valuesLength; i++) {
                    let state = {value: this.state.value, isVisible: this.state.isVisible};
                    state.isVisible = value !== values[i];
                    this.setState(state);
                }
            }
        }
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
