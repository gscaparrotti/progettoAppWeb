export class User {

  public codicefiscale: string;
  public nome: string;
  public cognome: string;
  public email: string;
  public password?: string;
  public requiredLegalAssistance: LegalAssistance[];

  constructor(codicefiscale: string, nome: string, cognome: string, email: string, password?: string, requiredLegalAssistance?: LegalAssistance[]) {
    this.password = password;
    this.email = email;
    this.cognome = cognome;
    this.nome = nome;
    this.codicefiscale = codicefiscale;
    this.requiredLegalAssistance = requiredLegalAssistance;
  }
}

export class LegalAssistance {

  public id: number;
  public user: User;
  public requestDate: Date;
  public paymentDate: Date;
  public paymentType: string;


  constructor(id: number, user: User, requestDate: Date, paymentDate: Date, paymentType: string) {
    this.id = id;
    this.user = user;
    this.requestDate = requestDate;
    this.paymentDate = paymentDate;
    this.paymentType = paymentType;
  }
}

export class DrunkDriving extends LegalAssistance {

  public tasso: number;
  public recidiva: boolean;
  public rifiutato: boolean;
  public estraneo: boolean;
  public incidente: boolean;


  constructor(id: number, user: User, requestDate: Date, paymentDate: Date, paymentType: string,
              tasso: number, recidiva: boolean, rifiutato: boolean, estraneo: boolean, incidente: boolean) {
    super(id, user, requestDate, paymentDate, paymentType);
    this.tasso = tasso;
    this.recidiva = recidiva;
    this.rifiutato = rifiutato;
    this.estraneo = estraneo;
    this.incidente = incidente;
  }
}

