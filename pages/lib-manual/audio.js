/**
 * 播放声音文件
 * @param  {Object} options 声音文件对象, id: 唯一标识, mp3: mp3文件路径, ogg: ogg文件路径
 */

export default function(options) {
    var id = 'j-audio-' + options.id;
    var el = document.getElementById(id);

    if (!el) {
        var fragment = document.createDocumentFragment();
        var audio = document.createElement('audio') //生成一个audio元素

        if (options.mp3) {
            var sourceMP3 = document.createElement('source');
            sourceMP3.src = options.mp3;
            fragment.appendChild(sourceMP3)
        }

        if (options.ogg) {
            var sourceOGG = document.createElement('source');
            sourceOGG.src = options.ogg;
            fragment.appendChild(sourceOGG)
        }

        audio.id = id;
        audio.controls = true // 这样控件才能显示出来
        audio.preload = 'auto'
        audio.appendChild(fragment)
        document.body.appendChild(audio) // 把它添加到页面中

        el = document.getElementById(id);
    }

    return el;
}
