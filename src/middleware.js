import { CHANGE_VIEW_MODEL, changeViewModel} from './actions';


let interval = null;

export const updateModelMiddleware = store => next => action => {
    if(action.type === CHANGE_VIEW_MODEL) {
        let tries = 0;
        // May be triggered when any member of a model has been changed
        if(interval === null) {
           console.debug('Interval enabled');
           interval = setInterval(() => {
                console.debug(tries);
                store.dispatch(changeViewModel({modelId: 'userViewModel', key: 'first_name', value: 'Attempt ' + tries++}));
            }, 15000);
        }
    }
    next(action);
};