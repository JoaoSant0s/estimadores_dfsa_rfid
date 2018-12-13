class Estimador {
    constructor() {
        this.teste = 0;
        this.totalSimulations = 2000;
        this.minTags = 100;
        this.maxTags = 1000;  
        this.initialFrameSize = 64;      

        this.estimadorObject ={
            slotsTotal : {
                lowerBound: [] ,
                eomLee:[],              
                chen: [],
            },
            slotsEmpty: {
                lowerBound: [],
                eomLee: [],
                chen:[]            
            },
            slotsCollisions: {
                lowerBound: [],
                eomLee: [],
                chen: []            
            },
            slotsEficiencia: {
                lowerBound: [],
                eomLee: [],
                chen: []            
            },
            slotsTime: {
                lowerBound: [],
                eomLee: [],
                chen: []            
            },
        }
    }

    init() {
        this.lowerBoundEstimator();
        this.eomLeeEstimator();  
        this.chenEstimator();      
    }   

    lowerBoundEstimator() {
        console.log("lowerBoundEstimator");

        for (let j = this.minTags; j <= this.maxTags; j += 100) {            
            var sigmaSlotsTotal = 0;
            var sigmaSlotsCollision = 0;
            var sigmaSlotsEmpties = 0;
            var sigmaSlotsSuccess = 0;    

            var sigmaTimeCount = 0;
            var sigmaTime = 0;               

            //var mediaCollided = 0
            for (let i = 0; i < this.totalSimulations; i++) {
                var frameSize = this.initialFrameSize;
                var totalSlots = frameSize;
                var collisionSlots = 0;
                var sucessSlots = 0;
                var emptiesSlots = 0;

                this.auxTime = 0;
                sigmaTimeCount = 0;
                var incrementalTime = 0;  

                var etiquetas = j;
                var stopCheck = false;

                var values = {
                    collided: 0,
                    empties: 0,
                    success: 0
                }

                do {
                    this.auxTime = 0;
                    sigmaTimeCount++;
                    var slots = new Array(frameSize).fill(0);
                    for (let i = 0; i < etiquetas; i++) {
                        var randomIndex = Math.floor(Math.random() * slots.length);
                        slots[randomIndex]++;
                    }

                    values.collided = slots.filter((value) => { return value > 1; }).length;
                    values.success = slots.filter((value) => { return value == 1; }).length;
                    values.empties = slots.filter((value) => { return value == 0; }).length;

                    frameSize = this.lowerBound(values.collided);

                    if (values.collided > 0) {
                        etiquetas -= values.success;
                    } else {
                        stopCheck = true;
                    }

                    totalSlots += frameSize;                    
                    collisionSlots += values.collided;
                    emptiesSlots += values.empties;
                    sucessSlots += values.success;
                    incrementalTime += this.auxTime
                } while (!stopCheck);
                
                sigmaSlotsTotal += totalSlots;
                sigmaSlotsCollision += collisionSlots;
                sigmaSlotsEmpties += emptiesSlots;
                sigmaSlotsSuccess += sucessSlots;   
                sigmaTime += Math.ceil(incrementalTime / sigmaTimeCount);
            }
            
            console.log(j, sigmaSlotsTotal / this.totalSimulations, sigmaSlotsCollision / this.totalSimulations, sigmaSlotsEmpties / this.totalSimulations, sigmaSlotsSuccess / this.totalSimulations, sigmaTime / this.totalSimulations)

            var auxTotalSlots = sigmaSlotsTotal / this.totalSimulations;

            this.estimadorObject.slotsTotal.lowerBound.push({ x: j, y: auxTotalSlots });
            this.estimadorObject.slotsEmpty.lowerBound.push({ x: j, y: Math.ceil(sigmaSlotsEmpties / this.totalSimulations) });
            this.estimadorObject.slotsCollisions.lowerBound.push({ x: j, y: Math.ceil(sigmaSlotsCollision / this.totalSimulations) });

            this.estimadorObject.slotsEficiencia.lowerBound.push({ x: j, y: (((sigmaSlotsSuccess / this.totalSimulations) / auxTotalSlots) * 100) })
            this.estimadorObject.slotsTime.lowerBound.push({ x: j, y: sigmaTime / this.totalSimulations })            
        }
    }

    lowerBound(collisionSlotsNumber) {
        var startTime = new Date().getTime();
        var result = collisionSlotsNumber * 2;
        var endTime = new Date().getTime();        
        this.auxTime = endTime - startTime;
        return result;
    }

    eomLeeEstimator(){
        console.log("eomLeeEstimator");

        for (let j = this.minTags; j <= this.maxTags; j += 100) {            
            var sigmaSlotsTotal = 0;
            var sigmaSlotsCollision = 0;
            var sigmaSlotsEmpties = 0;
            var sigmaSlotsSuccess = 0;  
            
            var sigmaTimeCount = 0;
            var sigmaTime = 0;   

            //var mediaCollided = 0
            for (let i = 0; i < this.totalSimulations; i++) {
                var frameSize = this.initialFrameSize;
                var totalSlots = frameSize;
                var collisionSlots = 0;
                var emptiesSlots = 0;
                var sucessSlots = 0;

                this.auxTime = 0;
                sigmaTimeCount = 0;
                var incrementalTime = 0;  

                var etiquetas = j;
                var stopCheck = false;

                var values = {
                    collided: 0,
                    empties: 0,
                    success: 0
                }

                do {
                    this.auxTime = 0;
                    sigmaTimeCount++;
                    var slots = new Array(frameSize).fill(0);
                    for (let i = 0; i < etiquetas; i++) {
                        var randomIndex = Math.floor(Math.random() * slots.length);
                        slots[randomIndex]++;
                    }

                    values.collided = slots.filter((value) => { return value > 1; }).length;
                    values.success = slots.filter((value) => { return value == 1; }).length;
                    values.empties = slots.filter((value) => { return value == 0; }).length;

                    frameSize = this.eomLee(frameSize, values.collided, values.success);                    

                    if (values.collided > 0) {
                        etiquetas -= values.success;
                    } else {
                        stopCheck = true;
                    }

                    totalSlots += frameSize;
                    collisionSlots += values.collided;
                    emptiesSlots += values.empties;
                    sucessSlots += values.success; 
                    incrementalTime += this.auxTime               
                } while (!stopCheck);

                sigmaSlotsTotal += totalSlots;
                sigmaSlotsCollision += collisionSlots;
                sigmaSlotsEmpties += emptiesSlots;
                sigmaSlotsSuccess += sucessSlots; 
                sigmaTime += Math.ceil(incrementalTime / sigmaTimeCount);
            }            

            console.log(j, sigmaSlotsTotal / this.totalSimulations, sigmaSlotsCollision / this.totalSimulations, sigmaSlotsEmpties / this.totalSimulations, sigmaSlotsSuccess / this.totalSimulations, sigmaTime / this.totalSimulations)            
            var auxTotalSlots = sigmaSlotsTotal / this.totalSimulations;

            this.estimadorObject.slotsTotal.eomLee.push({ x: j, y: auxTotalSlots })
            this.estimadorObject.slotsEmpty.eomLee.push({ x: j, y: Math.ceil(sigmaSlotsEmpties / this.totalSimulations) })
            this.estimadorObject.slotsCollisions.eomLee.push({ x: j, y: Math.ceil(sigmaSlotsCollision / this.totalSimulations) })
            this.estimadorObject.slotsEficiencia.eomLee.push({ x: j, y: (((sigmaSlotsSuccess / this.totalSimulations) / auxTotalSlots) * 100) })                         
            this.estimadorObject.slotsTime.eomLee.push({ x: j, y: sigmaTime / this.totalSimulations })                       
        }
    }    

    eomLee(frameSize, slotsCollisionNumber, slotsSuccessNumber) {
        var startTime = new Date().getTime();
        var b, kb, num, den, frac, k_aux, yk;
        var k = 2.0;
        var f = 0;

        var collisionFloat = parseFloat(slotsCollisionNumber);
        var successFloat = parseFloat(slotsSuccessNumber);

        do {
            b = frameSize / ((k * collisionFloat) + successFloat);
            frac = Math.exp(-(1.0 / b));
            num = (1.0 - frac);
            den = (b * (1.0 - (1.0 + (1.0 / b)) * frac));
            yk = num / den;

            f = yk * collisionFloat;

            k_aux = k;
            k = yk;
        }
        while (Math.abs(k - k_aux) > 0.001);

        var result = Math.ceil(f);

        var endTime = new Date().getTime();
        this.auxTime = endTime - startTime;

        return result
    }

    chenEstimator(){
        console.log("chenEstimator");

        for (let j = this.minTags; j <= this.maxTags; j += 100) {            
            var sigmaSlotsTotal = 0;
            var sigmaSlotsCollision = 0;
            var sigmaSlotsEmpties = 0;
            var sigmaSlotsSuccess = 0;

            var sigmaTimeCount = 0;
            var sigmaTime = 0;  

            //var mediaCollided = 0
            for (let i = 0; i < this.totalSimulations; i++) {
                var frameSize = this.initialFrameSize;
                var totalSlots = frameSize;
                var collisionSlots = 0;
                var emptiesSlots = 0;
                var sucessSlots = 0;

                this.auxTime = 0;
                sigmaTimeCount = 0;
                var incrementalTime = 0;  

                var etiquetas = j;
                var stopCheck = false;

                var values = {
                    collided: 0,
                    empties: 0,
                    success: 0
                }

                do {
                    this.auxTime = 0;
                    sigmaTimeCount++;
                    var slots = new Array(frameSize).fill(0);
                    for (let i = 0; i < etiquetas; i++) {
                        var randomIndex = Math.floor(Math.random() * slots.length);
                        slots[randomIndex]++;
                    }

                    values.collided = slots.filter((value) => { return value > 1; }).length;
                    values.success = slots.filter((value) => { return value == 1; }).length;
                    values.empties = slots.filter((value) => { return value == 0; }).length;

                    frameSize = this.chen(values.empties, values.collided, values.success);

                    if (values.collided > 0) {
                        etiquetas -= values.success;
                    } else {
                        stopCheck = true;
                    }

                    totalSlots += frameSize;
                    collisionSlots += values.collided;
                    emptiesSlots += values.empties;
                    sucessSlots += values.success;
                    incrementalTime += this.auxTime     
                } while (!stopCheck);

                sigmaSlotsTotal += totalSlots;
                sigmaSlotsCollision += collisionSlots;
                sigmaSlotsEmpties += emptiesSlots;
                sigmaSlotsSuccess += sucessSlots;
                sigmaTime += Math.ceil(incrementalTime / sigmaTimeCount);
            }            

            console.log(j, sigmaSlotsTotal / this.totalSimulations, sigmaSlotsCollision / this.totalSimulations, sigmaSlotsEmpties / this.totalSimulations, sigmaSlotsSuccess / this.totalSimulations, sigmaTime / this.totalSimulations)
            var auxTotalSlots = sigmaSlotsTotal / this.totalSimulations;

            this.estimadorObject.slotsTotal.chen.push({ x: j, y: auxTotalSlots })
            this.estimadorObject.slotsEmpty.chen.push({ x: j, y: Math.ceil(sigmaSlotsEmpties / this.totalSimulations) })
            this.estimadorObject.slotsCollisions.chen.push({ x: j, y: Math.ceil(sigmaSlotsCollision / this.totalSimulations) })
            this.estimadorObject.slotsEficiencia.chen.push({ x: j, y: (((sigmaSlotsSuccess / this.totalSimulations) / auxTotalSlots) * 100) })
            this.estimadorObject.slotsTime.chen.push({ x: j, y: sigmaTime / this.totalSimulations })                 
        }
    }

    chen(slotsEmptiesNumber, slotsCollisionNumber, slotsSuccessNumber){
        var startTime = new Date().getTime();

        var floatSlotsEmptiesNumber = parseFloat(slotsEmptiesNumber);
        var floatSlotsCollisionNumber = parseFloat(slotsCollisionNumber);
        var floatSlotsSuccessNumber = parseFloat(slotsSuccessNumber);

        var l = floatSlotsEmptiesNumber + floatSlotsCollisionNumber + floatSlotsSuccessNumber;
        var n = floatSlotsSuccessNumber + 2.0 * floatSlotsCollisionNumber;
        var next = 0.0;
        var previus = -1.0;

        while (previus < next) {
            var pE = Math.pow((1.0 - (1.0 / l)), n);
            var pS = (n/l) * Math.pow( (1.0 - (1.0 / l) ), (n - 1.0) );
            var pC = 1.0 - pE - pS;
            previus = next;
            next = this._simple_factorial(l, floatSlotsEmptiesNumber, floatSlotsSuccessNumber, floatSlotsCollisionNumber) * Math.pow(pE, floatSlotsEmptiesNumber) * Math.pow(pS, floatSlotsSuccessNumber) * Math.pow(pC, floatSlotsCollisionNumber);
            n = n + 1.0;
        }
        var nChen = n - 2.0;

        var endTime = new Date().getTime();

        this.auxTime = endTime - startTime;

        return nChen;
    }

    _simple_factorial(a, b, c, d){
        var result = 1.0

        while (a > 1.0){
            result = result * a

            a = a - 1.0
            if (b > 1.0){
                result = result / b
                b = b - 1.0
            }	                

            if (c > 1.0){
                result = result / c
                c = c - 1.0
            }                            

            if (d > 1.0){
                result = result / d
                d = d - 1.0
            }	      
        }
	    
        return result;
    }

    /* 
    def simple_factorial(a, b, c, d)
	  result = 1.0

	  while a > 1
	    result = result * a
	    a = a -1
	    if b > 1
	      result = result/b
	      b = b - 1
	    end

	    if c > 1
	      result = result/c
	      c = c - 1
	    end

	    if d > 1
	      result = result/d
	      d = d - 1
	    end
	  end

	  result
	en
    
    */


}
