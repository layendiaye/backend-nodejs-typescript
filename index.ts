abstract class Entity {
    public id:number; 
    constructor(id:number){
        this.id=id;
    }  
}

class Person extends Entity
{
    public firstName:string;
    public lastName:string;
    constructor(id:number,firstName:string,lastName:string)
    {
        super(id);
        this.firstName=firstName;
        this.lastName=lastName;
    }
}

class company extends Entity
{
    public name:string;
    constructor(id:number,name:string)
    {
        super(id);
        this.name=name;
        
    }
}

interface IDatatProvider{
    list():Entity[];
    search(text:string):Entity[];
}
//en typscript il n'y a pas de modificateur d'accessibilité(private, protected ou public).
abstract class BaseProvider implements IDatatProvider
{
    //protected car ce sont les heritier qui l'utilise
    protected abstract getData():Entity[];
    public list():Entity[]{
        return this.getData();
    }
   public search(texte:string):Entity[]{
    // recherche:string = texte.toLowerCase();
    // let listeFiltree:Entity[] = [];
    // for (const element of data) {
    //     // includes : string -> boolean (true ou false)
    //     let text = JSON.stringify(element);
    //     text = text.toLowerCase();
    //     if (text.includes(recherche) === true) {
    //         listeFiltree.push(element);
    //     }
    // }
    let text:string = texte.toLowerCase();
    return this.getData().filter(x => JSON.stringify(x).toLowerCase().includes(text));
        //     //La méthode filter() crée et retourne un nouveau tableau contenant tous les éléments du tableau 
        //     //d'origine qui remplissent une condition déterminée par la fonction callback.
    }

}

class PersonProvider extends BaseProvider
{
    //on peut mettre aussi getData():Person[]
    protected getData():Entity[]{
        let p1:Person=new Person(1,"Sophie","Lozopie");
        let p2:Person=new Person(2,"Annie","Versaire");
        let p3:Person=new Person(3,"Paul","Ochon");

        return [p1,p2,p3];

     }
}
class CompanyProvider extends BaseProvider
{
    //on peut mettre aussi getData():Entity[]
    protected getData():company[]{
        let c1:company=new company(1,"Google");
        let c2:company=new company(2,"Apple");
        let c3:company=new company(3,"Microsoft");

        return [c1,c2,c3];

    }
}

class RepositoryService
{
    private providers:IDatatProvider[]; //providers=un propriete attribut
    constructor(providers:IDatatProvider[]){//une dependance: ce qu'on exige lors de l'instanciation
        this.providers=providers;
    }
   public list():Entity[]{
        let resultat:Entity[]=[];//attribut pour faire traitement qui sencé de mourrir
        for(const provider of this.providers)
        {
            resultat=resultat.concat(provider.list());
        }
        return resultat;
      
    }
    public search(text:string){
        let resultat:Entity[]=[];
        for(const provider of this.providers)
        {
            let result:Entity[]=provider.search(text);
            resultat=resultat.concat(result);
           //ou  resultat=resultat.concat(provider.search(text));
        }
        return resultat;
    }
}

const pers:PersonProvider=new PersonProvider();
const comp:CompanyProvider=new CompanyProvider();
const serv:RepositoryService=new RepositoryService([pers,comp]);
//ber.providers=[jose,sop];
console.log(serv.list());
console.log(serv.search('so'));
const express=require('express');
const cors=require('cors');

//on defini le serveur
let app=express();// creation du serveur
app.use(cors());//utiliation de cors:autoriser les requetes http provenant d'une autre origine
//(c'est a dire sauter les limitation de sécurité coté navigateur), permettre au backend de tjours repondre oui
app.use(express.json());//utilisation du json:permettre la communication des dnnées au format json

//GET(recuperation de données)-- list
//POST(envoie de données avec intention de creation)
//PUT (envoie de données avec intention de modification)
//PATCH(envoie de données avec une intention de modification partielle (par exple juste le nom))
//DELETE(suppression de données)

app.get('/',function (req:any,res:any) {//un endpoint
    // '/' est le debut l'uri. exple get('/spectacle/id)
    res.send(serv.list());
});

//creer un nveau endpoint qui accepte les requetes en post avec une donnée texte 
app.post('/', function(req:any,res:any){//on peut mettre post('/search'
    res.send(serv.search(req.body.text));//le payload=données envoyer un requete post
//req.body.text=payload, c'est ce que le client envoie au serveur(serv)
});
 //lancer le serveur
app.listen(4000, function()
{
    console.log("listen on port 4000 haha...");
})



