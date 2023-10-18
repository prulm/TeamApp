import axios from 'axios'
import {
LOADING,
CREATE_PROJECT_SUCCESS,
CREATE_PROJECT_FAIL,
UPDATE_PROJECT_SUCCESS,
UPDATE_PROJECT_FAIL,
LOAD_PROJECT_SUCCESS,
LOAD_PROJECT_FAIL,
DELETE_PROJECT_SUCCESS,
DELETE_PROJECT_FAIL,
CREATE_TASK_SUCCESS,
CREATE_TASK_FAIL,
LOAD_TASK_SUCCESS,
GENERATE_REPORT_SUCCESS,
GENERATE_REPORT_FAIL,
ADD_COMMENT_SUCCESS,
ADD_COMMENT_FAIL,
LOAD_TASK_FAIL
} from './types'

export const create_project = (name, description, team, deadline, sharedFile) => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'multipart/form-data',
			'Authorization': `JWT ${localStorage.getItem('access')}`
		}
	}
	let body = new FormData()

	if (sharedFile)
		body.append('sharedFile', sharedFile, sharedFile.name)
	body.append('name', name)
	body.append('description', description)
	body.append('team', parseInt(team))
	body.append('deadline', deadline)
	console.log(team)
	console.log(description)
	dispatch({ type: LOADING })
	try {
		const res = await axios.post(`${process.env.REACT_APP_API_URL}/project/create/`, body, config)
		dispatch({
			type: CREATE_PROJECT_SUCCESS
		})
	} catch (err) {
		dispatch({
			type: CREATE_PROJECT_FAIL
		})
	}
}

export const load_project = () => async dispatch => {
	const config = {
		headers: {
			'Accept': 'application/json',
			'Authorization': `JWT ${localStorage.getItem('access')}`
		}
	}
	try {
		const res = await axios.get(`${process.env.REACT_APP_API_URL}/project/load/`, config)
		dispatch({
			type: LOAD_PROJECT_SUCCESS,
			payload: res.data
		})
	} catch (err) {
		dispatch({
			type: LOAD_PROJECT_FAIL
		})
	}
}

export const delete_project = (id) => async dispatch => {
	const config = {
		headers: {
			'Authorization': `JWT ${localStorage.getItem('access')}`
		}
	}
	dispatch({ type: LOADING })
	try {
		const res = await axios.delete(`${process.env.REACT_APP_API_URL}/project/delete/${id}/`, config)
		dispatch({
			type: DELETE_PROJECT_SUCCESS
		})
	} catch (err) {
		dispatch({
			type: DELETE_PROJECT_FAIL
		})
	}
}

export const create_task = (name, description, assignees, project, is_recurring, is_dependent, dependees, is_subtask, parent, cycle, deadline, file) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `JWT ${localStorage.getItem('access')}`
    }
  }
  let body = new FormData()

  if (file)
    body.append('file', file, file.name)
  body.append('name', name)
  body.append('description', description)
  body.append('assignees', assignees)
  body.append('dependees', dependees)
  body.append('deadline', deadline)
  body.append('is_subtask', is_subtask)
  body.append('is_recurring', is_recurring)
  body.append('is_dependent', is_dependent)
  body.append('project', project)
  body.append('parent', parent)
  body.append('cycle', cycle)
  console.log(assignees)
  dispatch({ type: LOADING })
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/project/task/create/`, body, config)
    dispatch({
      type: CREATE_TASK_SUCCESS
    })
  } catch (err) {
    dispatch({
      type: CREATE_TASK_FAIL
    })
  }
}


export const my_tasks = () => async dispatch => {
	const config = {
		headers: {
			'Accept': 'application/json',
			'Authorization': `JWT ${localStorage.getItem('access')}`
		}
	}
  dispatch({ type: LOADING })
	try {
		const res = await axios.get(`${process.env.REACT_APP_API_URL}/project/task/mine/`, config)
		dispatch({
			type: LOAD_TASK_SUCCESS,
			payload: res.data
		})
	} catch (err) {
		dispatch({
			type: LOAD_TASK_FAIL
		})
	}
}


export const generate_report = (proj_id) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${localStorage.getItem('access')}`
    },
    responseType: 'blob'  // Set response type to 'blob' to handle binary data (PDF)
  };

  const body = { proj_id };

  dispatch({ type: LOADING });

  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/project/generate-report/`, {
      ...config,
      params: body  // Pass the project ID as query parameter
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));

    // Create a temporary link and click it to initiate the download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'report.pdf');
    document.body.appendChild(link);
    link.click();

    dispatch({
      type: GENERATE_REPORT_SUCCESS
    });
  } catch (err) {
    dispatch({
      type: GENERATE_REPORT_FAIL
    });
  }
};


export const addComment = (content, task, user) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${localStorage.getItem('access')}`
    },
  };
  const body = JSON.stringify({ content, task, user }); // Pass an object to JSON.stringify()
  dispatch({ type: LOADING });
  
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/project/task/comment/`, body, config); // Swap the order of 'body' and 'config'

    dispatch({
      type: ADD_COMMENT_SUCCESS,
      payload: 'Comment added'
    });
  } catch (error) {
    dispatch({
      type: ADD_COMMENT_FAIL,
      payload: 'Failed to add comment',
    });
  }
};

export const attach_file = (task, file) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `JWT ${localStorage.getItem('access')}`
    }
  }
  let body = new FormData()

  body.append('file', file, file.name)
  body.append('task', task)
  dispatch({ type: LOADING })
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/project/task/attach-file/`, body, config)
    dispatch({
      type: CREATE_TASK_SUCCESS
    })
  } catch (err) {
    dispatch({
      type: CREATE_TASK_FAIL
    })
  }
}


export const start_task = (task) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${localStorage.getItem('access')}`
    }
  }
  dispatch({ type: LOADING })
  try {
    const res = await axios.patch(`${process.env.REACT_APP_API_URL}/project/task/start/${task}/`, config)
    dispatch({
      type: CREATE_TASK_SUCCESS
    })
  } catch (err) {
    dispatch({
      type: CREATE_TASK_FAIL
    })
  }
}


export const finish_task = (task) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${localStorage.getItem('access')}`
    }
  }
  dispatch({ type: LOADING })
  try {
    const res = await axios.patch(`${process.env.REACT_APP_API_URL}/project/task/finish/${task}/`, config)
    dispatch({
      type: CREATE_TASK_SUCCESS
    })
  } catch (err) {
    dispatch({
      type: CREATE_TASK_FAIL
    })
  }
}