export default async function userProfile({ params }: any){
    const { id } = await params;
    return (
        <div>
            <h1>user profile</h1>
            <p>user id: {id}</p>
        </div>
    )
}