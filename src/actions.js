export const CHANGE_MODEL_VIEW = 'CHANGE_MODEL_VIEW';
export const MODEL_CHANGED = 'MODEL_CHANGED';
export const CHANGE_VIEW_MODEL = 'CHANGE_VIEW_MODEL';

export function changeViewModel(payload) {
    return {
        type: CHANGE_VIEW_MODEL,
        payload: payload
    }
}

export function updateModel() {
    return {
        type: CHANGE_MODEL_VIEW,
    }
}
