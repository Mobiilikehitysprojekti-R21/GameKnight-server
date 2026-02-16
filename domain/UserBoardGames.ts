export interface UserBoardGamesProps {
    auth0_id: string;
    bgg_id: number;
}

class UserBoardGames implements UserBoardGamesProps {
    constructor (
    public readonly auth0_id: string,
    public readonly bgg_id: number,
    ) {
        
    }
}

export default UserBoardGames;