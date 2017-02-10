import Rx from 'rxjs/Rx';

import React from 'react';
import ReactDom from 'react-dom';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Provider} from 'react-redux'

import {changeViewModel, updateModel} from './actions';

import {createStore, applyMiddleware} from 'redux';
import {modelApp} from './reducers';
import {updateModelMiddleware} from './middleware';

const middleware = applyMiddleware(updateModelMiddleware);
const store = createStore(modelApp, middleware);

class InputText extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(newValue) {
        this.props.onChange('name', newValue);
    }

    render() {
        return (
            <div>
                <h5>{this.props.model.get('name')}</h5>
                <input type='text' value={this.props.model.get('name')} onChange={event => this.handleChange(event.target.value) }/>
                <br /><br />
                <input type='text' value={this.props.model.get('type')} />
            </div>
        );
    }
}

class Form extends React.Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(key, value) {
        if (key === 'name') {
            this.props.onViewModelUpdate(key, value);
        }
    }

    render() {
        return (
            <form>
                <InputText model={this.props.model} onChange={this.onChange}/>
            </form>
        )
    }
}

class FormContainer extends React.Component {

    constructor(props) {
        super(props);
        this.onViewModelUpdate = this.onViewModelUpdate.bind(this);
    }

    componentDidMount() {
        const {updateModel} = this.props;
        updateModel();
    }

    onViewModelUpdate(key, value) {
        const { changeViewModel } = this.props;
        changeViewModel({key: key, value: value});
    }

    render() {
        return <Form model={this.props.model.get('viewModel')} onViewModelUpdate={ this.onViewModelUpdate }/>
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        model: state,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({changeViewModel, updateModel}, dispatch);
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
