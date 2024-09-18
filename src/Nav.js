import {Link} from 'react-router-dom'

export default function Nav()
{
return(
    <div className="w-full font-bold flex gap-4 h-8 bg-gray-800">
        <div>
            <h1 className="text-orange-300">MakeYourNotes</h1>
            </div>
            <div>
       
          <Link to="/books"  className="hover:text-yellow-500">your books</Link>
          </div>
    </div>
)
}