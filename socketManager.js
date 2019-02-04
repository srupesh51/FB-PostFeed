const io = require('./server.js').io

const { USER_LOGIN, USER_LOGOUT,SEND_LIKE,SEND_COMMENT,SEND_POST } = require('./Events')


module.exports = function(socket){

	// console.log('\x1bc'); //clears console
	console.log("Socket Id:" + socket.id);

	//Verify Username
	socket.on(USER_LOGIN, (id)=>{
		io.emit(USER_LOGIN, id);
	});
	socket.on(SEND_LIKE, (post_data)=>{
		io.emit(SEND_LIKE, post_data);
	});
	socket.on(SEND_POST, (post_data)=>{
		io.emit(SEND_POST, post_data);
	});
	socket.on(SEND_COMMENT, (post_data)=>{
		io.emit(SEND_COMMENT, post_data);
	});
	socket.on(USER_LOGOUT, (empty)=>{
		io.emit(USER_LOGOUT, null);
	});
}
