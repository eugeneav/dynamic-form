import {Record, Map} from 'immutable';
import {CHANGE_VIEW_MODEL, GET_ACTIVE_USER} from './actions';

const UserModel = Record(
    {
        id: '',
        first_name: 'Unknown',
        last_name: 'Unknown',
        email: 'Unknown',
        address: 'Unknown',
        field1: 'Unknown',
        field2: 'Unknown'
    }
);

const userModelInstance = new UserModel({
    id: 'userModel',
    first_name: 'John',
    last_name: 'Doe',
    email: 'jd@gmail.com',
    address: 'Unknown',
    field1: 'Unknown',
    field2: 'Unknown'
});

const state = new Map({userModel: userModelInstance, userViewModel: null});

export function modelApp(model = state, action) {
    switch (action.type) {
        case CHANGE_VIEW_MODEL:
            let viewModel = model.get(action.payload.modelId);
            let newViewModel = viewModel.withMutations((modelTmp) => {
                let data = modelTmp.get(action.payload.key);
                data.value =  action.payload.value;
                let newData = {
                    id: action.payload.key,
                    value: action.payload.value,
                    isVisible: data.isVisible,
                    hideFor: data.hideFor || {},
                };
                return modelTmp.set(action.payload.key, newData);
            });

            return model.withMutations(tmpState => tmpState.set(action.payload.modelId, newViewModel));

            break;
        case GET_ACTIVE_USER:
            const userModelInstance = model.get('userModel');

            let userViewModel = new UserModel(
                {
                    id: 'userViewModel',
                    first_name: {
                      id: 'first_name',
                      value: userModelInstance.get('first_name'),
                      isVisible: true,
                    },
                    last_name: {
                        id: 'last_name',
                        value: userModelInstance.get('last_name'),
                        isVisible: true,
                    },
                    email: {
                        id: 'email',
                        value: userModelInstance.get('email'),
                        isVisible: true,
                        hideFor: {
                            first_name: [1, 2, 'HIDE_EMAIL']
                        }
                    },
                    address: {
                        id: 'address',
                        value: userModelInstance.get('address'),
                        isVisible: false,
                    },
                    field1: {
                        id: 'field1',
                        value: userModelInstance.get('field1'),
                        isVisible: false,
                    },
                    field2: {
                        id: 'field2',
                        value: userModelInstance.get('field2'),
                        isVisible: false,
                    }
                }
            );

            return model.withMutations(tmpState => tmpState.set(userViewModel.get('id'), userViewModel));
            break;
        default:
            return model;
    }
}


