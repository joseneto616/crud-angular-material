import { Component, OnInit, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule} from '@angular/material/form-field'
import { MatInputModule} from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Cliente } from './cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrasilapiService } from '../brasilapi.service';
import { Estado, Municipio } from '../brasil.api.models';
import { CommonModule } from '@angular/common';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-cadastro',
  imports: [
    FlexLayoutModule, 
    MatCardModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    NgxMaskDirective,
    CommonModule,
    MatSelectModule
  ],
  providers: [
    provideNgxMask()
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent implements OnInit{

    cliente: Cliente = Cliente.newCliente();
    atualizando: boolean = false;
    snack: MatSnackBar = inject(MatSnackBar);
    estados: Estado[] = [];
    municipios: Municipio[] = [];

    constructor(private service: ClienteService, private route: ActivatedRoute, private router: Router, private brasilApiService: BrasilapiService){
      
    }

    ngOnInit(): void {
      this.route.queryParamMap.subscribe((query: any) => {
        const params = query['params']
        const id = params['id']
        if(id){
          let clienteEncontrado = this.service.buscarClientePorId(id);
          if(clienteEncontrado){
            this.atualizando = true;
            this.cliente = clienteEncontrado;
            if(this.cliente.uf){
              const event = { value: this.cliente.uf };
              this.carregarMunicipios(event as MatSelectChange);
            }
          }
        }
      })

      this.carregarUFs();
    }

    carregarUFs(){
      this.brasilApiService.listaUFs().subscribe({
        next: listaEstados => this.estados = listaEstados,
        error: erro => console.log("ocorreu um erro: ", erro)
      })
    }

    carregarMunicipios(event: MatSelectChange){
      const ufSelecionada = event.value;
      this.brasilApiService.listaMunicipios(ufSelecionada).subscribe({
        next: listaMunicipios =>  this.municipios = listaMunicipios,
        error: erro => console.log('ocorreu um erro: ', erro)
      })
    }

    salvar(){
      if(!this.atualizando){
        this.service.salvar(this.cliente);
        this.cliente = Cliente.newCliente();
        this.mostrarMensagem('Salvo com Sucesso')
      } else{
        this.service.atualizar(this.cliente);
        this.router.navigate(['/consulta']);
      }
      
    }

    mostrarMensagem(mensagem: string){
      this.snack.open(mensagem, "Ok")
    }
}
