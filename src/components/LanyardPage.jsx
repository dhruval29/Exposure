import Lanyard from './Lanyard/Lanyard.jsx'

export default function LanyardPage() {
	return (
		<div style={{ width: '100%', height: '100vh' }}>
			<Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
		</div>
	)
}


