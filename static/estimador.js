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
                eomLee:[]               
            },
            slotsEmpty: {
                lowerBound: [],
                eomLee: []                
            },
            slotsCollisions: {
                lowerBound: [],
                eomLee: []
            },
            slotsEficiencia: {
                lowerBound: [],
                eomLee: []
            },
            slotsTime: {
                lowerBound: [],
                eomLee: []
            },
        }
    }

    init() {
        this.lowerBoundEstimator();
        this.eomLeeEstimator();        
    }   

    lowerBoundEstimator() {
        console.log("lowerBoundEstimator");

        for (let j = this.minTags; j <= this.maxTags; j += 100) {
            var startTime = new Date().getTime();
            var sigamSlotsTotal = 0;
            var sigamSlotsCollision = 0;
            var sigamSlotsEmpties = 0;
            var sigamSlotsSuccess = 0;            

            //var mediaCollided = 0
            for (let i = 0; i < this.totalSimulations; i++) {
                var frameSize = this.initialFrameSize;
                var totalSlots = frameSize;
                var collisionSlots = 0;
                var sucessSlots = 0;
                var emptiesSlots = 0;

                var etiquetas = j;
                var stopCheck = false;

                var values = {
                    collided: 0,
                    empties: 0,
                    success: 0
                }

                do {
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

                } while (!stopCheck);

                sigamSlotsTotal += totalSlots;
                sigamSlotsCollision += collisionSlots;
                sigamSlotsEmpties += emptiesSlots;
                sigamSlotsSuccess += sucessSlots;                
            }

            var endTime = new Date().getTime();

            console.log(j, sigamSlotsTotal / this.totalSimulations, sigamSlotsCollision / this.totalSimulations, sigamSlotsEmpties / this.totalSimulations, sigamSlotsSuccess/this.totalSimulations)
            var auxTotalSlots = sigamSlotsTotal / this.totalSimulations;

            this.estimadorObject.slotsTotal.lowerBound.push({ x: j, y: auxTotalSlots })
            this.estimadorObject.slotsEmpty.lowerBound.push({ x: j, y: sigamSlotsEmpties / this.totalSimulations })
            this.estimadorObject.slotsCollisions.lowerBound.push({ x: j, y: sigamSlotsCollision / this.totalSimulations })
            this.estimadorObject.slotsEficiencia.lowerBound.push({ x: j, y: (((sigamSlotsSuccess / this.totalSimulations) / auxTotalSlots) * 100) })
            this.estimadorObject.slotsTime.lowerBound.push({ x: j, y: (endTime - startTime) })            
        }
    }

    eomLeeEstimator(){
        console.log("eomLeeEstimator");

        for (let j = this.minTags; j <= this.maxTags; j += 100) {
            var startTime = new Date().getTime();
            var sigamSlotsTotal = 0;
            var sigamSlotsCollision = 0;
            var sigamSlotsEmpties = 0;
            var sigamSlotsSuccess = 0;    

            //var mediaCollided = 0
            for (let i = 0; i < this.totalSimulations; i++) {
                var frameSize = this.initialFrameSize;
                var totalSlots = frameSize;
                var collisionSlots = 0;
                var emptiesSlots = 0;
                var sucessSlots = 0;

                var etiquetas = j;
                var stopCheck = false;

                var values = {
                    collided: 0,
                    empties: 0,
                    success: 0
                }

                do {
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
                } while (!stopCheck);

                sigamSlotsTotal += totalSlots;
                sigamSlotsCollision += collisionSlots;
                sigamSlotsEmpties += emptiesSlots;
                sigamSlotsSuccess += sucessSlots; 
            }

            var endTime = new Date().getTime();

            console.log(j, sigamSlotsTotal / this.totalSimulations, sigamSlotsCollision / this.totalSimulations, sigamSlotsEmpties / this.totalSimulations, sigamSlotsSuccess / this.totalSimulations)            
            var auxTotalSlots = sigamSlotsTotal / this.totalSimulations;

            this.estimadorObject.slotsTotal.eomLee.push({ x: j, y: auxTotalSlots })
            this.estimadorObject.slotsEmpty.eomLee.push({ x: j, y: sigamSlotsEmpties / this.totalSimulations })
            this.estimadorObject.slotsCollisions.eomLee.push({ x: j, y: sigamSlotsCollision / this.totalSimulations })
            this.estimadorObject.slotsEficiencia.eomLee.push({ x: j, y: (((sigamSlotsSuccess / this.totalSimulations) / auxTotalSlots) * 100) })            
            this.estimadorObject.slotsTime.eomLee.push({ x: j, y: (endTime - startTime) })            
        }
    }    

    lowerBound(collisionSlotsNumber){
        return collisionSlotsNumber * 2
    }

    eomLee(frameSize, slotsCollisionNumber, slotsSuccessNumber){
        var b, kb, num, den, frac;
        var k = 2.0;

        do {
            kb = k;
            b = frameSize / ( (kb * slotsCollisionNumber) + slotsSuccessNumber);
            frac = Math.exp(-(1 / b));
            num = 1 - frac;
            den = (b * (1-(1+(1/b)) * frac));
            k = num / den;
        }
        while (Math.abs(kb - k) < 0.001);

        return Math.ceil(k * slotsCollisionNumber);
    }


}
