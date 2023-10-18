import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { load_project } from '../actions/project'
import Sidebar from '../components/sidebar'
import '../styles/projects.scss'
import ProjectBox from '../components/projectbox'
import ProjModal from '../components/projcreatemodal'
import CommentsModal from '../components/commentsmodal'
import TaskDetailsModal from '../components/taskdetailmodal'
import ProjDelete from '../components/deleteProj'
import AddTask from '../components/addTask'

const Projects = ({ load_project, isLoading, projects }) => {
  const [newProject, setNewProject] = useState(false)
  const [comments, setComments] = useState(false)
  const [detail, setDetail] = useState(false)
  const [deleteProj, setDeleteProj] = useState(false)
  const [addTask, setAddTask] = useState(false)
  const [currentProj, setCurrentProj] = useState()
  const [currentTask, setCurrentTask] = useState()
  const [percentage, setPercentage] = useState(0)

  const progressStyle = (tasks) => {
    const totalTasks = tasks.length;
    let completedTasks = 0;
    if (totalTasks === 0) {
      return { 'width': '0%' };
    }
    tasks.forEach((task) => {
      if (task.end_date) {
        completedTasks++;
      }
    });
    const progressPercentage = (completedTasks / totalTasks) * 100;
    return { 'width': `${progressPercentage.toFixed(0)}%` };
  };

  useEffect(() => {
    load_project();
  }, []);

  const setProj = (proj, type) => {
    setCurrentProj(proj);
    if (type === 'delete') {
      setDeleteProj(true);
    } else if (type === 'task') {
      setAddTask(true);
    }
  };

  const handleComment = (task) => {
    setCurrentTask(task);
    setComments(true);
  };

  const handleDetail = (task) => {
    setCurrentTask(task);
    setDetail(true);
  };
  return (
    <>
      <Helmet>
        <title>TeamTrek</title>
        <meta name="description" content="Teamtrek: a team collaboration and task management suite" />
      </Helmet>
      <div className='proj-container'>
        <Sidebar />
        <div className='proj-body'>
          <button onClick={() => setNewProject(true)}>New Project</button>
          {projects && projects != '' ? projects.map((project, index) =>
            <ProjectBox key={index} project={project} onDetail={handleDetail} onComment={handleComment} onTask={() => { setProj(project, 'task') }} onDelete={() => { setProj(project, 'delete') }} />
          ) : isLoading ? <AiOutlineLoading3Quarters className='loading' /> :
            <div className='team'><h2>You don't have any projects</h2></div>}
        </div>
        <ProjModal open={newProject} onClose={() => { setNewProject(false) }} />
        <ProjDelete proj={currentProj} open={deleteProj} onClose={() => { setDeleteProj(false) }} />
        <AddTask proj={currentProj} open={addTask} onClose={() => { setAddTask(false) }} />
        <CommentsModal task={currentTask} open={comments} onClose={() => { setComments(false) }} />
        <TaskDetailsModal task={currentTask} open={detail} onClose={() => { setDetail(false) }} />
      </div>
    </>
  )
}

const mapStateToProps = state => ({
  isLoading: state.trek.isLoading,
  projects: state.trek.projects
})

export default connect(mapStateToProps, { load_project })(Projects);
