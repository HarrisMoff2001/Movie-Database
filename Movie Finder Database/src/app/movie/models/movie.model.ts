export class Movie {
  public reviews: { username: string; rating: number; content: string }[] = [];
  public cast: {id: string, gender: string; name: string; profile_path: string; character: string;}[] = [];
  public averageRating: number = 0;
  public certification: string | null = null;
  // struggled to get this to work as a string with the additional info from the youtube API so I've resulted to using the type any (I know it's not ideal but I couldn't figure it out otherwise)
  public trailer: any; 
  public providers: {
    logo_path: string;
    provider_id: string;
    provider_name: string;
  }[] = [];

  constructor (
    public id: string,
    public name: string,
    public imgURL: string,
    public genre_ids: string,
    public genre: string[],
    public overview: string,
    public tagline: string,
    public releaseDate: string,
    public status: string,
    public homepage: string, 
    public budget: string,
    public revenue: string,
    public runtime: string, 
    public profit: string,
    public production_companies: string[],
    public spoken_languages: string[],
  ) { }
}