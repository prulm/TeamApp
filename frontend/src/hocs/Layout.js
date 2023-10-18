import React from 'react'
import { checkAuthenticated, load_user } from '../actions/auth'
import { connect } from 'react-redux'

const Layout = (props) => {
	React.useEffect(() => {
	    props.checkAuthenticated()
	    props.load_user()
  	}, [])
	return (
		<div>
			{props.children}
		</div>
	)
}

export default connect(null, { checkAuthenticated, load_user })(Layout);