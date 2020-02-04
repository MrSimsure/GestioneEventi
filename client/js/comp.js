class Comp
{
    constructor(dom)
    {
        this.html = dom;
        this.name = dom.getAttribute("id")
    }


    delete()
    {
        $( this.html ).remove();
    }
}