// Este arquivo faz parte do serviço backend para gerenciamento de usuários.
interface UserRequest {
    name: string;
    email: string;
    password: string;
}

// Importando a interface UserRequest para definir o tipo de dados esperados
class userService {
    async execute({name, email, password}: UserRequest){


        return { name: name }
    }
        
}


export { userService };