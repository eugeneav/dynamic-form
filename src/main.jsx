import React from 'react';
import ReactDom from 'react-dom';
import {Provider, connect} from 'react-redux';
import {changeViewModel, updateModel, getActiveUser} from './actions';

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
        const { id } = this.props.data;
        this.props.onChange(id, newValue);
    }

    render() {
        return null;
    }
}

class InputText extends InputBase {
    render() {
        const {value, isVisible} = this.props.data;
        const component = <div>
            <input
                type='text'
                value={value}
                onChange={event => this.onChange(event.target.value) }
            />
        </div>;

        return isVisible ? component : null;
    }
}

class Form extends React.Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(key, value) {
        this.props.onViewModelUpdate(key, value);
    }

    render() {
        const {model} = this.props;

        let form = null;
        if (model) {
            form =
                <form>
                    <InputText data={model.get('first_name')} onChange={this.onChange}/>
                    <InputText data={model.get('last_name')} onChange={this.onChange}/>
                    <InputText data={model.get('email')} onChange={this.onChange}/>
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

    componentWillReceiveProps(nextProps) {
        console.debug('nextProps', nextProps);
    }

    componentDidMount() {
        const {getActiveUser} = this.props;
        console.debug('getActiveUser()');
        getActiveUser();
    }

    onViewModelUpdate(key, value) {
        const {changeViewModel, model} = this.props;
        changeViewModel({modelId: model.get('id'), key: key, value: value});
    }

    render() {
        return <Form model={this.props.model} onViewModelUpdate={ this.onViewModelUpdate }/>
    }
}

const mapStateToProps = (state, ownProps) => {

    return {
        model: state.get('userViewModel'),
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({changeViewModel, updateModel, getActiveUser}, dispatch);
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
