import {AiOutlineInfoCircle} from 'react-icons/ai'
import { toast } from 'react-toastify'

const WordCountInfo = () => {
    const notify = () => toast("Answer correctly 3 times to learn the word",{toastId:'learnSystemToast',type:'info'})

return (
    <div className='cursor-pointer' onClick={notify}>
    <AiOutlineInfoCircle className='opacity-50 text-m'/>
    </div>
)
}

export default WordCountInfo
