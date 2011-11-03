.. -*- mode: rst; coding: utf-8 -*-
.. :Progetto:  apmobile --
.. :Creato:    mer 16 feb 2011 13:40:35 CET
.. :Autore:    Alberto Berti <alberto@metapensiero.it>
.. :Licenza:   GNU General Public License version 3 or later
..

===============
 Airpim mobile
===============


Interesting infos
=================

Documentation pages and other stuff

Android
  * `Android local developer docs <file://./parts/android_sdk/docs/index.html>`_
  * `Android git repos <http://android.git.kernel.org>`_
  * `Android online dev docs <http://developer.android.com>`_

Appcelerator titanium mobile
  * `Titanium mobile docs <http://developer.appcelerator.com/documentation>`_
  * `Titanium mobile guides <http://guides.appcelerator.com/>`_
  * `Appcelerator video guides <http://vimeo.com/appcelerator>`_
  * `Appcelerator nightly builds <http://builds.appcelerator.com.s3.amazonaws.com/index.html>`_
  * `Appcelerator bug tracker <https://appcelerator.lighthouseapp.com/projects/32238-titanium-mobile/tickets>`_
  * `Appcelerator repos <https://github.com/appcelerator>`_
  * `Some explanations about Titanium build process <http://stackoverflow.com/questions/4217551/what-happens-to-javascript-code-after-app-is-compiled-using-titanium-mobile/4798547#4798547>`_
  * `Titanium releases list <https://api.appcelerator.net/p/v1/release-list>`_
  * `Jasmine unittests tools <http://pivotal.github.com/jasmine/>`_
  * `Extanium js library for Ti mobile
    <https://github.com/kyr0/Extanium/>`_
  * `An alternative approach at Titanium programming
    `https://github.com/krawaller/Struct>`_
  * `Tools for running Ti Mobile apps with Eclipse editor <https://github.com/billdawson/tidevtools>`_

Installation instructions
=========================

There are some prerequisites for using and compiling projects using
Android. So, in a terminal run::

  $ sudo apt-get install ant openjdk-6-jdk

Other packages are needed for running test apap service, so you may
have those already installed::

  $ sudo apt-get install libxml2-dev libxslt-dev python-imaging python-pyexiv2

Still there are other packages that are needed to run the testing
infrastructure::

  $ sudo apt-get install wmctrl libcv2.1 libcvaux2.1 libhighgui2.1
  $ sudo apt-get install xephyr openbox screen

Please uninstall any other jdk that may be on the system, then run::

  $ python bootstrap.py
  $ bin/buildout

This will install all the needed stuff to create, build and run
applications developed with Android and Appcelerator Titanium. Further
commands will use the Paver build tool. To have an idea of what's
available run::

  $ bin/paver --help

and also::

  $ bin/paver <command> --help

To try out Titanium demos run::

  $ bin/paver install_demos

Then use a standalone terminal to run the phone emulator, that will
stay attached to that terminal and will print a _huge_ amount of log
messages::

  $ bin/paver emulator -d demos/KitchenSink/KitchenSink

when the rate of logs gets reduced, you can start the compilation of
the project that will build, install and run the demo app on the
emulator::

  $ bin/paver run -d demos/KitchenSink/KitchenSink


