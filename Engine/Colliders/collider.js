/**
 * functions for all sorts of collisions
 */

class Collider {

    static Collision_Projection(a, b){
        // make projection axises from poligon with less edges
        // zaenx uzamem unijo, morm se sprobat vec nacinov
        var edges = [...new Set([...a.edges, ...b.edges])]; //a.edges.length > b.edges.length ? b.edges : a.edges;
        
        var max = -Infinity;
        var edgeLen =edges.length;
        for(var i = 0; i < edgeLen; i++){
            // take axis perpendicular to the current edge
            var axis = new Vector2D(-edges[i].Y, edges[i].X);
            axis.normalize();

            // project points from both poligons on axis 
            var projectionA = Collider.pointProjection(a.points, axis);
            var projectionB = Collider.pointProjection(b.points, axis);

            // check if there is no intersaction
            var intersaction = Collider.checkIntersaction(projectionA, projectionB);
            if(intersaction >= 0){
                if(max < intersaction)
                    max = intersaction;
                continue;
            }
            return;
        }

        Collider.collisonDetected(a, b, max)
    }

    static pointProjection(points, axis){
        var min = Infinity;
        var max = -min;

        var product;
        var pointsLen=points.length;
        for(var i = 0; i < pointsLen; i++){
            product = math.dot(points[i].Array, axis.Array);

            if(product < min)
                min = product;
            if(product > max)
                max = product;
        }

        return {min: min, max: max};
    }

    static checkIntersaction(a, b){
        if(a.min < b.min)
            return a.max - b.min
        
        return b.max - a.min
    }

    static Collision_Circle_vs_Rect(circle, rect){

    var distx = Math.abs(circle.x - rect.position.X);
    var disty = Math.abs(circle.y - rect.position.Y);

    if (distx > (rect.size.X/2 + circle.radius)) { return false; }
    if (disty > (rect.size.Y/2 + circle.radius)) { return false; }

    if (distx <= (rect.size.X/2)) { return true; } 
    if (disty <= (rect.size.Y/2)) { return true; }

    var hypot = (distx - rect.size.X/2)*(distx- rect.size.X/2) +
                         (disty - rect.size.Y/2)*(disty - rect.size.Y/2);

//console.log(hypot <= (circle.radius*circle.radius))
    return (hypot <= (circle.radius*circle.radius));
   
    }



    static collisonDetected(a, b, intersaction){
        if (typeof a.collisionEvent === 'function')
            a.collisionEvent(b, intersaction);
        
        if (typeof b.collisionEvent === 'function')
            b.collisionEvent(a, intersaction);
    }
}
