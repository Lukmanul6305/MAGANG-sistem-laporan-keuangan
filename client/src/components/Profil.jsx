import { useNavigate } from "react-router-dom"


const Profil = ()=>{
  const navigate = useNavigate()
  function handleClick(e){
    e.preventDefault();
    navigate("/profil")

  }
    return(
        <div className="fixed">
          <button onClick={(e)=>handleClick(e)} className="h-10 fixed right-5 top-5"><img src="https://images.icon-icons.com/3066/PNG/512/user_person_profile_avatar_icon_190943.png" className="w-10" alt="kok gk da sih?" /></button>
        </div>
    )
}

export default Profil