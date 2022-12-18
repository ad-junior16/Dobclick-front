export default class Cliente {
    Id: number;
    nome: string;
    contato: string;
    usuarioId: number;
    label: string = "";

    constructor(Id:number,nome:string,contato:string,usuarioId:number) {
        this.Id = Id;
        this.nome = nome;
        this.contato = contato;
        this.usuarioId = usuarioId;
    }

    // Id!: number;

    // @Column({nullable: false})
    // nome!: string;

    // @Column({nullable: false})
    // contato!: string;

    // @ManyToOne(() => UsuarioEntity,(usuario)=> usuario.Id)
    // usuario!: UsuarioEntity | null;


}