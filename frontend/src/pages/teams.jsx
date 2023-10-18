import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { load_team } from '../actions/team'
import { BsPersonFillAdd } from 'react-icons/bs'
import Sidebar from '../components/sidebar'
import '../styles/teams.scss'
import TeamModal from '../components/teamcreatemodal'
import InviteModal from '../components/InviteModal'
import TeamDetailsModal from '../components/teamdetailmodal'

const Teams = ({ load_team, teams, isLoading }) => {

	const [openModal, setOpenModal] = useState(false)
	const [openTeam, setOpenTeam] = useState(false)
	const [openInvite, setOpenInvite] = useState(false)
	const [currentTeam, setCurrentTeam] = useState()

	useEffect(() => {
		load_team()
	}, [])

	const invitation = (team) => {
		setCurrentTeam(team)
		setOpenInvite(true)
	}
	const handleTeam = (team) => {
		setCurrentTeam(team)
		setOpenTeam(true)
	}
	return (
		<>
        <Helmet>
            <title>TeamTrek</title>
            <meta name="description" content="Teamtrek: a team collaboration and task management suite"  />
        </Helmet>
			<div className='teams-container'>
				<Sidebar />
				<div className='teams-body'>
					<button className='new-team' onClick={() => setOpenModal(true)}>New Team</button>
					
					{teams && teams != '' ? teams.map((team, index) => 
					<div className='team' key={index}>	
						<div className='title' onClick={() => handleTeam(team)}>
							<h2>{team.name}</h2>
							<h4>{team.members.length} {team.members.length == 1 ? <>Member</> : <>Members</>}</h4>
						</div>
						<abbr title='Invite'>
							<BsPersonFillAdd className='add-icon' onClick={() => invitation(team)} />
						</abbr>
					</div>

					) : <h2>You're not part of any team</h2>}
				</div>
				<TeamModal open={openModal} onClose={() => setOpenModal(false)} />
				<InviteModal team={currentTeam} open={openInvite} onClose={() => setOpenInvite(false)} />
				<TeamDetailsModal team={currentTeam} open={openTeam} onClose={() => setOpenTeam(false)} />
			</div>
		</>
	)
}

const mapStateToProps = state => ({
  isLoading: state.trek.isLoading,
  teams: state.trek.teams
})

export default connect(mapStateToProps, { load_team })(Teams)