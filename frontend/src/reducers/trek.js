import {
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	USER_LOADED_SUCCESS,
	USER_LOADED_FAIL,
	AUTHENTICATED_SUCCESS,
	AUTHENTICATED_FAIL,
	LOADING,
	EDIT_ACCOUNT_SUCCESS,
	EDIT_ACCOUNT_FAIL,
	PASSWORD_RESET_SUCCESS,
	PASSWORD_RESET_FAIL,
	PASSWORD_RESET_CONFIRM_SUCCESS,
	PASSWORD_RESET_CONFIRM_FAIL,
	SIGNUP_SUCCESS,
	SIGNUP_FAIL,
	CREATE_TEAM_SUCCESS,
	CREATE_TEAM_FAIL,
	LOAD_TEAM_SUCCESS,
	LOAD_TEAM_FAIL,
	CREATE_PROJECT_SUCCESS,
	CREATE_PROJECT_FAIL,
	LOAD_PROJECT_SUCCESS,
	LOAD_PROJECT_FAIL,
	DELETE_PROJECT_SUCCESS,
	DELETE_PROJECT_FAIL,
	CREATE_TASK_SUCCESS,
	CREATE_TASK_FAIL,
	INVITE_MEMBER_SUCCESS,
	INVITE_MEMBER_FAIL,
	LOAD_TASK_SUCCESS,
	LOAD_TASK_FAIL,
	GENERATE_REPORT_SUCCESS,
	GENERATE_REPORT_FAIL,
	ADD_COMMENT_SUCCESS,
	ADD_COMMENT_FAIL,
	DELETE_TEAM_SUCCESS,
	DELETE_TEAM_FAIL,
	LOGOUT
} from '../actions/types'

const initialState = {
	access: localStorage.getItem('access'),
	refresh: localStorage.getItem('refresh'),
	isAuthenticated: null,
	isLoading: false,
	user: null,
	error: null
}

export default function trek(state = initialState, action) {
	const { type, payload, error } = action

	switch(type) {
		case AUTHENTICATED_SUCCESS:
			return {
				...state,
				isAuthenticated: true
			}
		case LOGIN_SUCCESS:
			localStorage.setItem('access', payload.access)
			return {
				...state,
				isAuthenticated: true,
				isLoading: false,
				access: payload.access,
				refresh: payload.refresh
			}
		case SIGNUP_SUCCESS:
			return {
				...state,
				isAuthenticated: false
			}
		case USER_LOADED_SUCCESS:
			return {
				...state,
				user: payload
			}
		case LOADING:
			return {
				...state,
				isLoading: true
			}
		case EDIT_ACCOUNT_SUCCESS:
			return {
				...state,
				isLoading: false,
				editAccount: true
			}
		case AUTHENTICATED_FAIL:
			return {
				...state,
				isAuthenticated: false,
				error: error
			}
		case USER_LOADED_FAIL:
			return {
				...state,
				user: null
			}
		case EDIT_ACCOUNT_FAIL:
			return {
				...state,
				editAccount: false,
				isLoading: false
			}
		case LOGIN_FAIL:
			return {
				...state,
				isAuthenticated: false,
				isLoading: false,
				access: null,
				refresh: null,
				user: null,
				error: payload
			}
		case SIGNUP_FAIL:
			return {
				...state,
				isAuthenticated: false,
				isLoading: false,
				access: null,
				refresh: null,
				user: null,
				error: payload
			}
		case LOGOUT:
			localStorage.removeItem('access')
			localStorage.removeItem('refresh')
			return {
				...state,
				isAuthenticated: false,
				isLoading: false,
				access: null,
				refresh: null,
				user: null
			}
//team
		case LOAD_TEAM_SUCCESS:
			return {
				...state,
				isLoading: false,
				teams: payload
			}

//project

		case LOAD_PROJECT_SUCCESS:
			return {
				...state,
				isLoading: false,
				projects: payload
			}

		case INVITE_MEMBER_FAIL:
			return {
				...state,
				isLoading: false,
				inviteFail: payload,
				inviteSuccess: ''
			}
		case INVITE_MEMBER_SUCCESS:
			return {
				...state,
				isLoading: false,
				inviteFail: '',
				inviteSuccess: 'Member invited!'
			}
		case LOAD_TASK_SUCCESS:
			return {
				...state,
				isLoading: false,
				tasks: payload
			}
		case GENERATE_REPORT_SUCCESS:
			return {
				...state,
				isLoading: false
			}
		case ADD_COMMENT_SUCCESS:
			return {
				...state,
				isLoading: false,
				commentSuccess: payload,
				commentFail: ''
			}
		case ADD_COMMENT_FAIL:
			return {
				...state,
				isLoading: false,
				commentFail: payload,
				commentSuccess: ''
			}
		case DELETE_TEAM_SUCCESS:
		case DELETE_TEAM_FAIL:
		case GENERATE_REPORT_FAIL:
		case LOAD_TASK_FAIL:
		case CREATE_TASK_SUCCESS:
		case CREATE_TASK_FAIL:
		case PASSWORD_RESET_SUCCESS:
		case CREATE_TEAM_SUCCESS:
		case CREATE_TEAM_FAIL:
		case CREATE_PROJECT_SUCCESS:
		case CREATE_PROJECT_FAIL:
		case DELETE_PROJECT_SUCCESS:
		case DELETE_PROJECT_FAIL:
		case LOAD_TEAM_FAIL:
		case LOAD_PROJECT_FAIL:
		case PASSWORD_RESET_FAIL:
		case PASSWORD_RESET_CONFIRM_SUCCESS:
		case PASSWORD_RESET_CONFIRM_FAIL:

			return {
				...state,
				isLoading: false
			}
		default:
			return state
	}
}