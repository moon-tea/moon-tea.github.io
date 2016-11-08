//A factory for creating a certain type of cruve
//This is a strict object composition using assign and mixins.

//type = linear, quadratic, logistic, 
//m = slope;, slope at infelction;
//k = exponent;, vertical size;
//b = y-intercept(vertical shift);
//c = x-intercept(horizontal shift);
var CurveStatic = {
    getPlot: function (x, type, m, k, b, c) {
        if(type == 'linear' || type == 'quadratic') {
            //f(x) = m*(x-c)^2+b
            return this.getQuadratic(x,m,k,b,c);
        }
        if(type == 'logistic') {
            //f(x) = (1/(1+e^x))
            return this.getLogistic(x,m,k,b,c);
        }
    },

    getLinear: function(x,m,k,b,c) {
        return getQuadratic(x,m, 1.0, b, c);
    },

    getQuadratic: function(x,m,k,b,c) {
        return m*Math.pow((x-c),k)+b;
    },

    getLogistic: function(x,m,k,b,c) {
        return k*(1/(1+Math.pow(1000*2.71*m, (-1*(x-c)))))+b;
    }
};

var CurveMaker = { 
    Curve: function(type,m,k,b,c) {
      return { 
          type: type,
          m:m,
          k:k,
          b:b,
          c:c,
          getPlot: function(x) {
              return CurveStatic.getPlot(x, this.type, this.m, this.k, this.b, this.c);
          }
       }
    }
};

var lin = CurveMaker.Curve('linear', 0.76, 1.0, 0.25, 0.0 );
var log = CurveMaker.Curve('logistic', 50, -0.95, 1.0, 0.6);

functionPlot({
  target: '#demo',
  //disableZoom: true,
  xAxis: {
    label: 'x - axis',
    domain: [0, 1]
  },
  yAxis: {
    label: 'y - axis',
    domain: [0, 1]
  },
  data: [{
    graphType: 'polyline',
    fn: function(scope){
      //return makeCurve(scope.x,'linear', 0.5, 1.0, 0.25, 0.0);
      return lin.getPlot(scope.x);
    }
  },
  {
    graphType: 'polyline',
    fn: function (scope) {
      return log.getPlot(scope.x);//makeCurve(scope.x,'logistic',50,-0.95,1.0,0.6);//1/Math.pow(base, x);
    },
    //fn: '2^(x)',//makeCurve('logistic',50,-0.95,1.0,0.6 ),
    //fnType: 'parametric',
    range: [0,1]
  }]
});
console.log(lin.getPlot(0.55));