
import { queryClient } from '@/lib/queryClient';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import axios from "axios";

const fetchUsers = async (): Promise<any> => {
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/users');
  return data;
};

const userQueryOptions = () => queryOptions({
  queryKey: ["users"],
  queryFn: () => fetchUsers()
})
export const Route = createFileRoute('/Users')({
component: Users,
loader: () => queryClient.ensureQueryData(userQueryOptions())
})

function Users() {
  const {data: users, isLoading, isError} = useSuspenseQuery(userQueryOptions())
  console.log({users, isLoading, isError});
  
  return <div>
      <h1>Users</h1>
      <ul>
        {
        // @ts-ignore
        users?.map(user => (
          <li key={user.id}>{user.name} ({user.email})</li>
        ))}
      </ul>
    </div>;
}


export default Users;
