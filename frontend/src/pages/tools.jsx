import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/sidebar'
import KanabanBoard from '../components/kanaban'
import PomodoroTimer from '../components/pomodoro'
import SettingsContextProvider from '../components/context/SettingsContext'
import '../styles/tools.scss'

const Tools = () => {
    const navigate = useNavigate()
	return (
		<div className='tools-container'>
			<Sidebar className='sb' />
			<div className='tools'>
				<KanabanBoard />
				<SettingsContextProvider>
				<PomodoroTimer />
				</SettingsContextProvider>
			</div>
		</div>
	)
}

export default Tools