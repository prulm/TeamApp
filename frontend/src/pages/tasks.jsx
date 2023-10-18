import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { MdDelete } from 'react-icons/md'
import { my_tasks } from '../actions/project'
import CommentsModal from '../components/commentsmodal'
import TaskDetailsModal from '../components/taskdetailmodal'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { FaComments } from 'react-icons/fa'
import Sidebar from '../components/sidebar'
import '../styles/tasks.scss'

const Tasks = ({ tasks, isLoading, onDelete, my_tasks }) => {
	const [currentTask, setCurrentTask] = useState()
	const [comment, setComment] = useState(false)
	const [detail, setDetail] = useState(false)
	useEffect (() => {
		my_tasks()
	}, [])
	const handleComment = (task) => {
		setCurrentTask(task)
		setComment(true)
	}
	const handleClick = (task) => {
		setCurrentTask(task)
		setDetail(true)
	}
	return (
		<>
	      	<Helmet>
	          	<title>TeamTrek</title>
	          	<meta name="description" content="Teamtrek: a team collaboration and task management suite"  />
	      	</Helmet>
			<div className='proj-container'>
				<Sidebar />
				<div className='proj-body'>
					{tasks && tasks != '' ?
					<> 
					<h1 style={{'alignSelf': 'flex-start', 'marginLeft': '50px'}}>Your tasks</h1>
				    <div className='main-table'>
				      <div className='table-row header'>
				        <div className='table-cell'>Name</div>
				        <div className='table-cell'>Deadline</div>
				        <div className='table-cell'>Start Date</div>
				        <div className='table-cell'>End Date</div>
				        <div className='table-cell'>Project</div>
				      </div>
				      {tasks.map((work, index) => (
				        <div key={index} className='table-row'>
				          <div className='table-cell' style={{'cursor': 'pointer'}} onClick={() => handleClick(work)}><abbr title={work.name}>{work.name}</abbr></div>
				          <div className='table-cell'>{work.deadline}</div>
				          <div className='table-cell'>{work.start_date ? <>{work.start_date}</> : <>-</>}</div>
				          <div className='table-cell'>{work.end_date ? <>{work.end_date}</> : <>-</>}</div>
				          <div className='table-cell'>{work.project.name}</div>
				          <div className='table-cell'>
				          	<abbr title='Delete task'>
				            <MdDelete className='delete' onClick={onDelete} />
				            </abbr>
				          </div>
				          <div className='table-cell'>
				          	<abbr title='Comments'>
				            <FaComments className='comment' onClick={() => handleComment(work)} />
				            </abbr>
				          </div>
				        </div>

				      ))}
				    </div>
					</> : isLoading ? <AiOutlineLoading3Quarters className='loading' /> :
					<><h1>You are not assigned any tasks</h1><small>Enjoy the silence</small></>}
				</div>
        <CommentsModal task={currentTask} open={comment} onClose={() => { setComment(false) }} />
        <TaskDetailsModal task={currentTask} open={detail} onClose={() => { setDetail(false) }} />
			</div>
		</>
	)
}

const mapStateToProps = state => ({
  isLoading: state.trek.isLoading,
  tasks: state.trek.tasks
})

export default connect(mapStateToProps, { my_tasks })(Tasks)