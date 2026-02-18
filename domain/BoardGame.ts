export interface BoardGameProps {
    game_id?: number;
    bgg_id: number;
    name: string;
    year_published?: number;
    rank?: number;
    bayes_average?: number;
    average?: number;
    users_rated?: number;
    is_expansion: boolean;
    thumbnail_url?: string;
}

class BoardGame implements BoardGameProps {
    constructor (
    public readonly bgg_id: number,
    public readonly name: string,
    public readonly is_expansion: boolean,
    public readonly game_id?: number,
    public readonly year_published?: number,
    public readonly rank?: number,
    public readonly bayes_average?: number,
    public readonly average?: number,
    public readonly users_rated?: number,
    public readonly thumbnail_url?: string,
    ) {
        
    }
}

export default BoardGame;
