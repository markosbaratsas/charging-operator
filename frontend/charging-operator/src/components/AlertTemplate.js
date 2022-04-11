import React from 'react';

// the style contains only the margin given as offset
// options contains all alert given options
// message is the alert message
// close is a function that closes the alert

const style = {
    backgroundColor: "#6ce2ad",
    padding: "10px 30px",
    color: "#f3f3f3",
    opacity: 1,
    display: "block",
    fontSize: "15px",
    lineHeight: "20px",
    zIndex: 100000,
    margin: "50px 0px 10px 0px",
    borderRadius: "5px"
}

// const AlertTemplate = ({ options, message, close }) => (

//   <div style={style}>
//     {options.type === 'info' && '! '}
//     {options.type === 'success' && ':) '}
//     {options.type === 'error' && ':( '}
//     {message}
//     {/* <button onClick={close}>X</button> */}
//   </div>
// )

// export default AlertTemplate;







const alertStyle = {
  backgroundColor: '#6ce2ad',
  color: 'white',
  borderRadius: '2px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 8px 12px 0 rgba(0,0,0,0.3)',
  width: '300px',
  boxSizing: 'border-box',
  fontSize: '11px',
  position: 'relative'
}

const contentWrapperStyle = {
  padding: '10px 10px 10px 10px',
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center'
}

const iconPlaceholderStyle = {
  display: 'flex',
  justifyContent: 'center',
  width: '50px'
}

const messageStyle = {
  flex: 3,
  textAlign: 'center',
  width: '100%',
  fontSize: "18px",
  fontFamily: "'Raleway', sans-serif"
}

const closeButtonStyle = {
  minWidth: '50px',
  height: '100%',
  position: 'absolute',
  borderRadius: '0 2px 2px 0',
  cursor: 'pointer',
  top: 0,
  right: 0,
  backgroundColor: '#6ce2ad',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const AlertTemplate = ({ message, options, style, close }) => (
  <div style={{ ...alertStyle, ...style }}>
    <div style={contentWrapperStyle}>
      <div style={messageStyle}>{message}</div>
    </div>
  </div>
)

export default AlertTemplate;
