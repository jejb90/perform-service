import { entrustConstants } from '../_constants/entrust.constants';
import { entrustService } from '../_services/entrust.service';
import { alertActions } from './';

export const entrustActions = {
    register,
    getAll,
};

function register(serv) {
    return dispatch => {
        dispatch(request(serv));

        entrustService.register(serv)
            .then(
                serv => {
                    dispatch(success());
                    dispatch(alertActions.success('Servicio Registrado'));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request(serv) { return { type: entrustConstants.REGISTER_REQUEST, serv } }
    function success(serv) { return { type: entrustConstants.REGISTER_SUCCESS, serv } }
    function failure(error) { return { type: entrustConstants.REGISTER_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        userService.getAll()
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error))
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}
