import {Record, Map} from 'immutable';
import {CHANGE_VIEW_MODEL, CHANGE_MODEL_VIEW} from './actions';

const ModelRecord = Record({name: 'Default'});
const modelRecordInstance = new ModelRecord({name: 'Def1'});

const ModelViewRecord = Record({name: 'Default', type: 'View'});
const modelViewRecordInstance = new ModelViewRecord({name: modelRecordInstance.get('name'), type: 'View'});

const state = new Map({model: modelRecordInstance, viewModel: modelViewRecordInstance});

export function modelApp(model = state, action) {
    switch (action.type) {
        case CHANGE_VIEW_MODEL:
            let viewModel = model.get('viewModel');
            let newViewModel = viewModel.withMutations((modelTmp) => {
                return modelTmp.set(action.payload.key, action.payload.value);
            });
            return model.set('viewModel', newViewModel);
            break;
        default:
            return model;
    }
}


