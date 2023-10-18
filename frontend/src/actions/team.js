import axios from 'axios'
import {
	LOADING,
	CREATE_TEAM_SUCCESS,
	CREATE_TEAM_FAIL,
	LOAD_TEAM_SUCCESS,
	LOAD_TEAM_FAIL,
	INVITE_MEMBER_SUCCESS,
	DELETE_TEAM_SUCCESS,
	DELETE_TEAM_FAIL,
	INVITE_MEMBER_FAIL
} from './types'

export const create_team = (name, description) => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `JWT ${localStorage.getItem('access')}`
		}
	}
	const body = JSON.stringify({ name, description })

	dispatch({ type: LOADING })
	try {
		const res = await axios.post(`${process.env.REACT_APP_API_URL}/team/create/`, body, config)
		dispatch({
			type: CREATE_TEAM_SUCCESS
		})
	} catch (err) {
		dispatch({
			type: CREATE_TEAM_FAIL
		})
	}
}

export const load_team = () => async dispatch => {
	const config = {
		headers: {
			'Accept': 'application/json',
			'Authorization': `JWT ${localStorage.getItem('access')}`
		}
	}
	try {
		const res = await axios.get(`${process.env.REACT_APP_API_URL}/team/load/`, config)
		dispatch({
			type: LOAD_TEAM_SUCCESS,
			payload: res.data
		})
	} catch (err) {
		dispatch({
			type: LOAD_TEAM_FAIL
		})
	}
}


export const delete_team = (id) => async dispatch => {
	const config = {
		headers: {
			'Authorization': `JWT ${localStorage.getItem('access')}`
		}
	}
	dispatch({ type: LOADING })
	try {
		const res = await axios.delete(`${process.env.REACT_APP_API_URL}/team/delete/${id}/`, config)
		dispatch({
			type: DELETE_TEAM_SUCCESS
		})
	} catch (err) {
		dispatch({
			type: DELETE_TEAM_FAIL
		})
	}
}


export const invite_member = (email, role, team) => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `JWT ${localStorage.getItem('access')}`
		}
	}
	const body = JSON.stringify({ email, role, team })
	dispatch({ type: LOADING })
	try {
		const res = await axios.post(`${process.env.REACT_APP_API_URL}/team/invite/`, body, config)
		dispatch({
			type: INVITE_MEMBER_SUCCESS
		})
	} catch (err) {
		console.log(err)
		if (err.response.status == 500) {
			dispatch({
				type: INVITE_MEMBER_FAIL,
				payload: 'User already exists in the team'
			})
		} else if (err.response.status == 400) {
			dispatch({
				type: INVITE_MEMBER_FAIL,
				payload: err.response.data.error
			})
		}
	}
}

export const invite_members = (emails, team) => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `JWT ${localStorage.getItem('access')}`
		}
	}
	const body = JSON.stringify({ emails, team })
	console.log(body)
	dispatch({ type: LOADING })
	try {
		const res = await axios.post(`${process.env.REACT_APP_API_URL}/team/invite/`, body, config)
		dispatch({
			type: INVITE_MEMBER_SUCCESS
		})
	} catch (err) {
		console.log(err)
		if (err.response.status == 500) {
			dispatch({
				type: INVITE_MEMBER_FAIL,
				payload: 'User already exists in the team'
			})
		} else if (err.response.status == 400) {
			dispatch({
				type: INVITE_MEMBER_FAIL,
				payload: err.response.data.error
			})
		}
	}
}