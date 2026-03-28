export default function userProfile({params} : any){
    return (
        <div>
            <h1>user profile</h1>
            <p>user id: {params.id}</p>
        </div>
    )
}