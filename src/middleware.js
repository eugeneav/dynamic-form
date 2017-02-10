import { CHANGE_MODEL_VIEW, changeViewModel} from './actions';

export const updateModelMiddleware = store => next => action => {

    // Example:
    // (action.type === CHANGE_MODEL_PROPERTY)
    // (action.type === CHANGE_MODEL_BATCH)
    // changeViewModel({ key: 'name', value: `new-name-${tries++}`})
    if(action.type === CHANGE_MODEL_VIEW) {
        let tries = 0;
        // May be triggered when any member of a model has been changed
        setInterval(() => {
            store.dispatch(changeViewModel({ key: 'name', value: `new-name-${tries++}`}))
        }, 5000);
    }
    next(action);
};