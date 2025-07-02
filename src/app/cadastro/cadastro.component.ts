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
    NgxMaskDirective
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

    constructor(private service: ClienteService, private route: ActivatedRoute, private router: Router){
      
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
          }
        }
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
