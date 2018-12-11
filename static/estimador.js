class Estimador {
    constructor() {
        
    }

    init() {
        this.collisionSimulator();
    }

    /* 
        Todas as etiquetas testadas
            Um contador, pois deve passar por todas as etiquetas e cada uma testar um slot, randomicamente
        Os slots possui uma quantidade
            Possui um tamanho inicial
            Cada entrada inicializada com zero
        Funcionamento básico
            Para cada etiqueta, é escolhido aleatoriamente uma posição no slot, adicionando o valor 1
            Após cada etiqueta, checagem
                Colisão: x > 1
                Vazio: x == 0
                Sucesso: x == 1    
    */    

    collisionSimulator(){
        var slots = new Array(64).fill(0);
        var etiquetas = 100;
        for (let i = 0; i < etiquetas; i++) {            
            var randomIndex = Math.floor(Math.random() * slots.length);
            slots[randomIndex] ++;            
        }

        var values ={
            collided: slots.filter((value)=>{
                return value > 1;
            }).length,
            empties: slots.filter((value) => {
                return value == 0;
            }).length,
            success: slots.filter((value) => {
                return value == 1
            }).length
        }
        return values;
    }

    /* 
        Algoritmo Lower Bound:

        Entrada: C	//quantidade de slots em colisão
        Saída: O tamanho do próximo quadro
        1	inicio
        2	|	int f;	// vê o tamanho do próximo quadro calculado
        3	|	f = C * 2;
        4	fim
        5	retorna f
    */

    lowerBound(collisionSlotsNumber){
        return collisionSlotsNumber * 2
    }

    /* 
        Algoritmo Eom-Lee:

        Entrada: f, C, S	// f = tamanho do quadro em análise, C = quantidade de slots em colisão, S = quantidade de slots bem sucedidos
        Saída: O tamanho do próximo quadro
    1	inicio
    2	|	double b, kb, num, den, frac;
    3	|	double k=2.0;
    4	|	repita
    5	|	|	kb=k;
    6	|	|	b =f/((k*1C)+S);
    7	|	|	frac=e-(1/);
    8	|	|	num=1-frac;
    9	|	|	den=((1-(1+(1/))frac));
    10	|	|	k = num/den;
    11	|	até <;	//= diferença entre o novo valor de e seu valor anterior delta =(=k-1-k) e =0.001
    12	fim
    13	retorna kC // tamanho do próximo frame f
    */

    eomLee(frameSize, slotsCollisionNumber, slotsSuccessNumber){
        var b, kb, num, den, frac;
        var k = 2;

        do {
            kb = k;
            b = frameSize / ((kb * slotsCollisionNumber) + slotsSuccessNumber);
            frac = Math.pow(e, -1/b);
            num = 1 - frac;
            den = (b * (1-(1+(1/b)) * frac));
            k = num / den;
        }
        while (Math.abs(kb - k) < 0.001);

        return k * slotsCollisionNumber;
    }


}
