
import { Message as message   } from 'element-ui'
class Message {
    constructor(){
        this.state = true
    }
    success(str){
        if (this.state) {
            message.success({message: str})
            changeState.call(this)
        }
    }
    warn(str){
        if (this.state) {
            message.warning({message: str})
            changeState.call(this)
        }
    }
    error(str) {
        if (this.state) {
            message.error({message: str})
            changeState.call(this)
        }
    }
    
}
function changeState(){
    this.state = false
    setTimeout(()=>{
        this.state = true
    },3000)
}

export default new Message()