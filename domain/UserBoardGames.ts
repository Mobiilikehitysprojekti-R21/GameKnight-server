export interface UserBoardGamesProps {
    userId: number;
    bgg_id: number;
}

class UserBoardGames implements UserBoardGamesProps {
    constructor (
    public readonly userId: number,
    public readonly bgg_id: number,
    ) {
        
    }
}

export default UserBoardGames;